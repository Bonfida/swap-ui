import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ButtonBorderGradient } from "../Buttons";
import { TokenInfo } from "@solana/spl-token-registry";
import { SelectCoin } from "./SelectCoin";
import { RefreshIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { FEES } from "../../settings/fees";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useLocalStorageState } from "ahooks";
import { Slippage } from "./Slippage";

// Token Mints
export const INPUT_MINT_ADDRESS =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
export const OUTPUT_MINT_ADDRESS =
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; // USDT

import { useJupiterApiContext } from "../../contexts";

interface IJupiterFormProps {}
interface IState {
  amount: number;
  inputMint: PublicKey;
  outputMint: PublicKey;
  slippage: number;
}

const JupiterForm: FunctionComponent<IJupiterFormProps> = (props) => {
  const { connected, publicKey, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const { tokenMap, routeMap, loaded, api } = useJupiterApiContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routes, setRoutes] = useState<
    Awaited<ReturnType<typeof api.v1QuoteGet>>["data"]
  >([]);

  const [slippage, setSlippage] = useLocalStorageState("slippage", {
    defaultValue: 1,
  });

  const [inputTokenInfo, setInputTokenInfo] = useState<
    TokenInfo | null | undefined
  >(tokenMap.get(INPUT_MINT_ADDRESS) as TokenInfo);
  const [outputTokenInfo, setOutputTokenInfo] = useState<
    TokenInfo | null | undefined
  >(tokenMap.get(OUTPUT_MINT_ADDRESS) as TokenInfo);

  const [inputAmout, setInputAmount] = useState("1");

  useMemo(() => {
    setInputTokenInfo(tokenMap.get(INPUT_MINT_ADDRESS) as TokenInfo);
    setOutputTokenInfo(tokenMap.get(OUTPUT_MINT_ADDRESS) as TokenInfo);
  }, [tokenMap]);

  // Good to add debounce here to avoid multiple calls
  const fetchRoute = React.useCallback(() => {
    if (!inputTokenInfo || !outputTokenInfo) return;
    setIsLoading(true);
    api
      .v1QuoteGet({
        amount: parseFloat(inputAmout) * Math.pow(10, inputTokenInfo?.decimals),
        inputMint: inputTokenInfo?.address,
        outputMint: outputTokenInfo?.address,
        slippage: 1, // 10bps TODO CHANGE
        feeBps: 1,
      })
      .then(({ data }) => {
        if (data) {
          setRoutes(data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api, inputAmout, inputTokenInfo, outputTokenInfo]);

  useEffect(() => {
    fetchRoute();
  }, [fetchRoute]);

  // ensure outputMint can be swapable to inputMint
  useEffect(() => {
    if (inputTokenInfo) {
      const possibleOutputs = routeMap.get(inputTokenInfo.address);

      if (
        possibleOutputs &&
        !possibleOutputs?.includes(outputTokenInfo?.address || "")
      ) {
        setOutputTokenInfo(tokenMap.get(possibleOutputs[0]));
      }
    }
  }, [inputTokenInfo, outputTokenInfo]);

  const handleSwap = async () => {
    try {
      if (!isLoading && routes?.[0] && publicKey && signAllTransactions) {
        setIsSubmitting(true);

        const { swapTransaction, setupTransaction, cleanupTransaction } =
          await api.v1SwapPost({
            body: {
              route: routes[0],
              userPublicKey: publicKey.toBase58(),
              // feeAccount: FEES.toBase58(),
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
        for (let transaction of transactions) {
          // get transaction object from serialized transaction

          // perform the swap
          const txid = await connection.sendRawTransaction(
            transaction.serialize()
          );

          await connection.confirmTransaction(txid);
          console.log(`https://solscan.io/tx/${txid}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsSubmitting(false);
  };

  const handleSwitch = () => {
    const _ = { ...inputTokenInfo } as TokenInfo;
    setInputTokenInfo(outputTokenInfo);
    setOutputTokenInfo(_);
  };

  const bestRoute = routes?.[0];
  console.log(bestRoute);
  const outputAmount =
    bestRoute &&
    (bestRoute.outAmount || 0) / Math.pow(10, outputTokenInfo?.decimals || 1);

  console.log(`Output ${outputAmount} Input ${inputAmout}`);

  console.log(`Pubkey ${publicKey?.toBase58()}`);
  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bg-base-200 w-[450px] rounded-[15px] px-5 pb-10 pt-5">
        <div className="relative">
          <Slippage slippage={slippage} setSlippage={setSlippage} />
          <button
            onClick={fetchRoute}
            disabled={isLoading}
            type="button"
            className="btn btn-sm btn-circle absolute right-2 top-0 bg-gray-200 bg-opacity-20 hover:bg-gray-200 hover:bg-opacity-20"
          >
            <RefreshIcon className="h-[20px]" />
          </button>
        </div>

        <div className="flex flex-col justify-between mt-10">
          <span className="text-white ml-3 font-bold">You pay</span>
          <div className="relative p-10 bg-neutral rounded-lg w-full my-5">
            <input
              value={inputAmout}
              type="number"
              onChange={(e) => setInputAmount(e.target.value.trim())}
              className="right-4 top-4 absolute input text-right bg-transparent text-xl font-bold focus:outline-0"
            />
            <div className="left-4 top-4 absolute">
              <SelectCoin
                tokenInfo={inputTokenInfo}
                setCoin={setInputTokenInfo}
              />
            </div>
          </div>

          <div className="flex flex-row justify-center my-1 w-full">
            <SwitchVerticalIcon
              onClick={handleSwitch}
              className="h-[30px] w-[30px] rotate-45 cursor-pointer"
            />
          </div>

          <span className="text-white ml-3 font-bold">You receive</span>
          <div className="relative p-10 bg-neutral rounded-lg w-full my-5">
            <div className="right-4 top-6 absolute input text-right bg-transparent text-xl font-bold">
              {outputAmount}
            </div>
            <div className="left-4 top-4 absolute">
              <SelectCoin
                tokenInfo={outputTokenInfo}
                setCoin={setOutputTokenInfo}
              />
            </div>
          </div>

          {connected ? (
            <ButtonBorderGradient
              onClick={handleSwap}
              disabled={isSubmitting}
              buttonClass="bg-black w-full p-2 uppercase font-bold h-[50px]"
              fromColor="green-400"
              toColor="blue-500"
            >
              {isSubmitting ? "Swapping.." : "Swap"}
            </ButtonBorderGradient>
          ) : (
            <div className="flex flex-row justify-center">
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
