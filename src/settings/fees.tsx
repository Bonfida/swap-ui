import { PublicKey } from "@solana/web3.js";

export const FEES = new PublicKey(import.meta.env.VITE_FEES as string);
export const FEES_BPS = parseInt(import.meta.env.VITE_FEES_BPS as string);
