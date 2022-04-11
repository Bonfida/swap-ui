import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRequest } from "ahooks";
import { TOKEN_PROGRAM_ID, AccountLayout, RawAccount } from "@solana/spl-token";

export const useTokenAccounts = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const fn = async (): Promise<RawAccount[]> => {
    if (!publicKey) return [];
    const results = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    return results.value
      .map((e) => AccountLayout.decode(e.account.data))
      .filter((e) => !!e) as RawAccount[];
  };

  return useRequest(fn, { refreshDeps: [connected], pollingInterval: 5_000 });
};
