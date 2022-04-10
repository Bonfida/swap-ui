import { Connection, PublicKey } from "@solana/web3.js";

export const validateUrl = async (url: string) => {
  const connection = new Connection(url);
  try {
    await connection.getAccountInfo(PublicKey.default);
    return true;
  } catch {
    return false;
  }
};
