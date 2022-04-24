import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useRequest } from "ahooks";
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  RawAccount,
  NATIVE_MINT,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export const useTokenAccounts = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const fn = async (): Promise<RawAccount[]> => {
    if (!publicKey) return [];
    const results = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    const accounts = results.value
      .map((e) => AccountLayout.decode(e.account.data))
      .filter((e) => !!e) as RawAccount[];

    // Add native SOL
    const balances = await connection.getBalance(publicKey);
    accounts.push({
      mint: NATIVE_MINT,
      owner: publicKey,
      amount: BigInt(balances),
      delegateOption: 0,
      delegate: PublicKey.default,
      state: 1,
      isNative: BigInt(1),
      isNativeOption: 1,
      delegatedAmount: BigInt(0),
      closeAuthorityOption: 0,
      closeAuthority: PublicKey.default,
    });

    accounts.sort((a, b) => {
      return parseInt(b.amount.toString()) - parseInt(a.amount.toString());
    });

    return accounts;
  };

  return useRequest(fn, {
    refreshDeps: [connected, publicKey, connection.rpcEndpoint],
    pollingInterval: 1_500,
  });
};
