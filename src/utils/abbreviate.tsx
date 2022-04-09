import { PublicKey } from "@solana/web3.js";

export const abbreviate = (pubkey: string | PublicKey, length = 7) => {
  let str: string;
  if (typeof pubkey === "string") {
    str = pubkey;
  } else {
    str = pubkey.toBase58();
  }
  return str.slice(0, length) + "..." + str.slice(-length);
};
