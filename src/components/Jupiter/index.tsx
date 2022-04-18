import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ButtonBorderGradient } from "../Buttons";
import { TokenInfo } from "@solana/spl-token-registry";
import { SelectCoin } from "./SelectCoin";
import { RefreshIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { FEES_BPS } from "../../settings/fees";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useLocalStorageState, useInterval } from "ahooks";
import { Slippage } from "./Slippage";
import {
  InlineResponseDefaultMarketInfos,
  InlineResponseDefaultData,
} from "@jup-ag/api";
import { SwapRoute } from "../SwapRoute";
import { toast } from "react-toastify";
import Loading from "../Loading";
import emoji from "../../assets/no-route.png";
import { getFeeAddress } from "../../utils/fees";
import { RenderUpdate } from "../../utils/notifications";
import { nanoid } from "nanoid";
import { Balance } from "./Balance";
import { useTokenAccounts } from "../../hooks";

// Token Mints
export const INPUT_MINT_ADDRESS =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
export const OUTPUT_MINT_ADDRESS =
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT

import { useJupiterApiContext } from "../../contexts";

interface IJupiterFormProps {}

const JupiterForm: FunctionComponent<IJupiterFormProps> = (props) => {
  const toastId = useRef(nanoid());
  const [firstLoad, setFirstLoad] = useState(false);
  const { connected, publicKey, signAllTransactions, sendTransaction } =
    useWallet();
  const { connection } = useConnection();
  const { tokenMap, routeMap, loaded, api } = useJupiterApiContext();
  const [routes, setRoutes] = useState<
    Awaited<ReturnType<typeof api.v1QuoteGet>>["data"]
  >([]);

  const [slippage, setSlippage] = useLocalStorageState("slippage", {
    defaultValue: 1,
  });
  const [selectedRoute, setSelectedRoute] =
    useState<InlineResponseDefaultData | null>(null);
  const [inputTokenInfo, setInputTokenInfo] = useState<
    TokenInfo | null | undefined
  >(tokenMap.get(INPUT_MINT_ADDRESS) as TokenInfo);
  const [outputTokenInfo, setOutputTokenInfo] = useState<
    TokenInfo | null | undefined
  >(tokenMap.get(OUTPUT_MINT_ADDRESS) as TokenInfo);
  const [hasRoute, setHasRoute] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(true); // Loading by default
  const { data: tokenAccounts, refresh: refreshToken } = useTokenAccounts();
  const [inputAmout, setInputAmount] = useState("1");

  useMemo(() => {
    setInputTokenInfo(tokenMap.get(INPUT_MINT_ADDRESS) as TokenInfo);
    setOutputTokenInfo(tokenMap.get(OUTPUT_MINT_ADDRESS) as TokenInfo);
  }, [tokenMap]);

  // Good to add debounce here to avoid multiple calls
  const fetchRoute = React.useCallback(() => {
    if (!inputTokenInfo || !outputTokenInfo) return;
    setLoadingRoute(true);
    api
      .v1QuoteGet({
        amount: parseFloat(inputAmout) * Math.pow(10, inputTokenInfo?.decimals),
        inputMint: inputTokenInfo?.address,
        outputMint: outputTokenInfo?.address,
        slippage: slippage,
        feeBps: FEES_BPS,
      })
      .then(({ data }) => {
        if (data) {
          setHasRoute(
            data.length > 0 && !!data[0].outAmount && data[0].outAmount > 0
          );
          setRoutes(data);
        }
      })
      .finally(() => {
        setLoadingRoute(false);
      });
  }, [api, inputAmout, inputTokenInfo, outputTokenInfo]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  const bestRoute = routes?.[0];

  useEffect(() => {
    if (!firstLoad && bestRoute) {
      setSelectedRoute(bestRoute);
      setFirstLoad(true);
    }
  }, [loaded, bestRoute]);

  useEffect(() => {
    setFirstLoad(false);
  }, [inputTokenInfo, outputTokenInfo, loadingRoute]);

  // ensure outputMint can be swapable to inputMint
  useEffect(() => {
    if (inputTokenInfo) {
      const possibleOutputs = routeMap.get(inputTokenInfo.address);

      if (
        possibleOutputs &&
        !possibleOutputs?.includes(outputTokenInfo?.address || "")
      ) {
        setHasRoute(false);
      }
    } else {
      setHasRoute(false);
    }
  }, [inputTokenInfo, outputTokenInfo]);

  const handleSwap = async () => {
    if (!outputTokenInfo?.address) return;

    const txids: string[] = [];
    try {
      if (!loadingRoute && selectedRoute && publicKey && signAllTransactions) {
        setSwapping(true);
        toast(<RenderUpdate updateText="Preparing transaction" load={true} />, {
          type: toast.TYPE.INFO,
          autoClose: false,
          toastId: toastId.current,
        });

        // Fee are in output token
        const { pubkey: feeAccount, ix } = await getFeeAddress(
          connection,
          new PublicKey(outputTokenInfo.address),
          publicKey
        );

        let feeTx: Transaction | undefined = undefined;
        if (ix) {
          feeTx = new Transaction().add(ix);
          const { blockhash } = await connection.getLatestBlockhash();
          feeTx.feePayer = publicKey;
          feeTx.recentBlockhash = blockhash;
          const sig = await sendTransaction(feeTx, connection);
          await connection.confirmTransaction(sig, "processed");
        }

        const { swapTransaction, setupTransaction, cleanupTransaction } =
          await api.v1SwapPost({
            body: {
              route: selectedRoute,
              userPublicKey: publicKey.toBase58(),
              feeAccount: feeAccount.toBase58(),
            },
          });
        const transactions = (
          [setupTransaction, swapTransaction, cleanupTransaction].filter(
            Boolean
          ) as string[]
        ).map((tx) => {
          return Transaction.from(Buffer.from(tx, "base64"));
        });

        await signAllTransactions(transactions);

        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: false,
          render: () => (
            <RenderUpdate updateText="Sending transaction" load={true} />
          ),
          toastId: toastId.current,
        });

        for (let transaction of transactions) {
          // get transaction object from serialized transaction

          // perform the swap
          const txid = await connection.sendRawTransaction(
            transaction.serialize()
          );

          txids.push(txid);
          await connection.confirmTransaction(txid, "processed");

          toast.update(toastId.current, {
            type: toast.TYPE.SUCCESS,
            autoClose: 5_000,
            render: () => (
              <RenderUpdate
                updateText="Transaction confirmed 👌"
                signatures={txids}
                load={true}
              />
            ),
            toastId: toastId.current,
          });

          console.log(txid);
        }
      }
    } catch (e) {
      console.error("Error", e);
      const isError = e instanceof Error;
      if (isError && e.message.includes("Transaction simulation")) {
        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: 5_000,
          render: () => (
            <RenderUpdate
              updateText="Transaction simulation failed"
              load={false}
            />
          ),
        });
      } else if (isError && e.message.includes("blockhash")) {
        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: 5_000,
          render: () => (
            <RenderUpdate updateText="Blockhash not found" load={false} />
          ),
          toastId: toastId.current,
        });
      } else if (
        isError &&
        e.message.includes("Transaction was not confirmed") &&
        txids.length > 0
      ) {
        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: 5_000,
          render: () => (
            <RenderUpdate
              updateText="Transaction failed to confirm. Inspect it on the explorer"
              load={false}
              signatures={txids}
            />
          ),
        });
      } else if (
        isError &&
        e.message.includes("Transaction was not confirmed")
      ) {
        toast.update(toastId.current, {
          type: toast.TYPE.INFO,
          autoClose: 5_000,
          render: () => (
            <RenderUpdate
              updateText="Transaction failed to confirm"
              load={false}
            />
          ),
        });
      } else {
        toast.update(toastId.current, {
          type: toast.TYPE.ERROR,
          autoClose: 5_000,
          render: () => (
            <RenderUpdate updateText="Transaction failed 🤯" load={false} />
          ),
        });
      }
    }
    refreshToken();
    setSwapping(false);
  };

  const handleSwitch = () => {
    const _ = { ...inputTokenInfo } as TokenInfo;
    setInputTokenInfo(outputTokenInfo);
    setOutputTokenInfo(_);
  };

  const outputAmount =
    bestRoute &&
    (bestRoute.outAmount || 0) / Math.pow(10, outputTokenInfo?.decimals || 1);

  const refresh = async () => {
    if (swapping) return;
    fetchRoute();
    refreshToken();
  };

  useInterval(() => {
    refresh();
  }, 15_000);

  return (
    <>
      <div className="bg-base-200 sm:w-[450px] w-[95%] rounded-[15px] px-5 pb-10 pt-5 mb-5 sm:mb-0 mt-3 sm:mt-0">
        <div className="relative">
          <Slippage slippage={slippage} setSlippage={setSlippage} />
          <button
            onClick={refresh}
            disabled={loadingRoute}
            type="button"
            className="absolute top-0 bg-gray-200 btn btn-sm btn-circle right-2 bg-opacity-20 hover:bg-gray-200 hover:bg-opacity-20"
          >
            <RefreshIcon className="h-[20px]" />
          </button>
        </div>

        <div className="flex flex-col justify-between mt-10">
          <div className="flex flex-row justify-between">
            <span className="ml-3 font-bold text-white">You pay</span>
            <Balance
              tokenAccounts={tokenAccounts}
              token={inputTokenInfo}
              setInput={setInputAmount}
            />
          </div>
          <div className="relative w-full p-10 my-5 rounded-lg bg-neutral">
            <input
              value={inputAmout}
              type="number"
              onChange={(e) => setInputAmount(e.target.value.trim())}
              className="absolute text-xl font-bold text-right bg-transparent right-4 top-4 input focus:outline-0"
            />
            <div className="absolute left-4 top-4">
              <SelectCoin
                tokenInfo={inputTokenInfo}
                setCoin={setInputTokenInfo}
              />
            </div>
          </div>

          <div className="flex flex-row justify-center w-full my-1">
            <SwitchVerticalIcon
              onClick={handleSwitch}
              className="h-[30px] w-[30px] rotate-45 cursor-pointer"
            />
          </div>

          <div className="flex flex-row justify-between mt-5">
            <span className="ml-3 font-bold text-white">You receive</span>
            <Balance tokenAccounts={tokenAccounts} token={outputTokenInfo} />
          </div>
          <div className="relative w-full p-10 my-5 rounded-lg bg-neutral">
            <div className="absolute text-xl font-bold text-right bg-transparent right-4 top-6 input">
              {outputAmount}
            </div>
            <div className="absolute left-4 top-4">
              <SelectCoin
                tokenInfo={outputTokenInfo}
                setCoin={setOutputTokenInfo}
              />
            </div>
          </div>
          {loadingRoute && (
            <div className="h-[216px]">
              <progress className="progress w-full h-[72px]"></progress>
              <progress className="progress w-full h-[72px]"></progress>
              <progress className="progress w-full h-[72px]"></progress>
            </div>
          )}
          {!hasRoute && !loadingRoute && (
            <div className="flex flex-row justify-center">
              <span className="mr-2 text-lg font-bold">No route found</span>
              <img className="h-[30px] w-[30px]" src={emoji} />
            </div>
          )}
          {!loadingRoute &&
            !!bestRoute &&
            !!bestRoute.marketInfos &&
            !!outputAmount &&
            !!hasRoute && (
              <button onClick={() => setSelectedRoute(bestRoute)}>
                <SwapRoute
                  isBestRoute={true}
                  route={bestRoute.marketInfos}
                  tokenMap={tokenMap}
                  selected={bestRoute === selectedRoute}
                  amount={outputAmount}
                />
              </button>
            )}
          {!loadingRoute &&
            hasRoute &&
            routes
              ?.slice(1)
              ?.filter((e) => !!e.marketInfos && !!e.outAmount)
              .map((r, idx) => {
                return (
                  <button
                    onClick={() => setSelectedRoute(r)}
                    key={`route-${idx}`}
                  >
                    <SwapRoute
                      route={
                        r.marketInfos as InlineResponseDefaultMarketInfos[]
                      }
                      tokenMap={tokenMap}
                      amount={
                        (r.outAmount as number) /
                        Math.pow(10, outputTokenInfo?.decimals || 0)
                      }
                      selected={r === selectedRoute}
                    />
                  </button>
                );
              })}

          {connected ? (
            <div className="mt-4">
              <ButtonBorderGradient
                onClick={handleSwap}
                disabled={swapping || !loaded || !hasRoute}
                buttonClass="bg-black w-full p-2 uppercase font-bold h-[50px]"
                fromColor="green-400"
                toColor="blue-500"
              >
                {swapping ? (
                  <div className="flex flex-row justify-center">
                    <span className="mr-2">Swapping</span>
                    <Loading />
                  </div>
                ) : (
                  "Swap"
                )}
              </ButtonBorderGradient>
            </div>
          ) : (
            <div className="flex flex-row justify-center mt-4">
              <WalletModalProvider>
                <WalletMultiButton />
              </WalletModalProvider>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JupiterForm;
