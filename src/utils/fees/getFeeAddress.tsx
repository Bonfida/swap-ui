import { Connection, PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { FEES } from "../../settings/fees";

export const getFeeAddress = async (
  connection: Connection,
  mint: PublicKey,
  payer: PublicKey
) => {
  const ata = await getAssociatedTokenAddress(mint, FEES);
  const info = await connection.getAccountInfo(ata);

  if (!info || !info.data) {
    const ix = createAssociatedTokenAccountInstruction(payer, ata, FEES, mint);
    return { pubkey: ata, ix };
  }

  return { pubkey: ata, ix: undefined };
};
