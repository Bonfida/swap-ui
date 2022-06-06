import { TokenInfo } from "@solana/spl-token-registry";
import { TokenAccounts } from "@bonfida/ui";
import round from "lodash/round";
import { PublicKey } from "@solana/web3.js";
import { useSolBalance } from "@bonfida/ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { NATIVE_MINT } from "@solana/spl-token";

export const Balance = ({
  token,
  tokenAccounts,
  setInput,
}: {
  token: TokenInfo | null | undefined;
  tokenAccounts: TokenAccounts | undefined;
  setInput?: (value: React.SetStateAction<string>) => void;
}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { data: solBalance } = useSolBalance(connection, publicKey);

  const wSol = token?.address === NATIVE_MINT.toBase58();

  const tokenAccount = token
    ? tokenAccounts?.getByMint(new PublicKey(token?.address))
    : null;

  if (!token) {
    return null;
  }

  const balance =
    tokenAccount && tokenAccount.decimals
      ? Number(tokenAccount.account.amount) /
        Math.pow(10, tokenAccount.decimals)
      : 0;

  return (
    <div className="flex flex-row items-center mr-1">
      <span className="mr-1 text-sm font-bold text-white">Balance: </span>
      <span className="mr-1 text-sm font-bold text-white opacity-40">
        {" "}
        {round(wSol ? solBalance?.uiAmount || 0 : balance, 2)}
      </span>

      {setInput && !!balance && (
        <>
          <div
            onClick={() => setInput((balance / 2).toString())}
            className="border-[2px] border-solid rounded-[20px] border-sky-500 w-[50px] text-center text-xs cursor-pointer uppercase font-bold mr-1"
          >
            Half
          </div>
          <div
            onClick={() => setInput(balance.toString())}
            className="border-[2px] border-solid rounded-[20px] border-sky-500 w-[50px] text-center text-xs cursor-pointer uppercase font-bold"
          >
            Max
          </div>
        </>
      )}
    </div>
  );
};
