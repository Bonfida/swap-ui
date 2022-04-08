import { PublicKey } from "@solana/web3.js";

export const FEES = new PublicKey(import.meta.env.VITE_FEES as string);
