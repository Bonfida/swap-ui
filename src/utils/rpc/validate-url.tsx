import { Connection, PublicKey } from "@solana/web3.js";

export const validateUrl = async (url: string) => {
  if (url.includes("quiknode.pro")) return true;
  const connection = new Connection(url);
  try {
    await connection.getAccountInfo(PublicKey.default);
    return true;
  } catch {
    return false;
  }
};
