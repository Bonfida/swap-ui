import { useRequest } from "ahooks";
import { useConnection } from "@solana/wallet-adapter-react";

// Empirical value
const THRESHOLD = 2_000;

export const useSolanaCongested = () => {
  const { connection } = useConnection();
  const fn = async () => {
    try {
      const samples = await connection.getRecentPerformanceSamples(1);
      const tps = samples[0].numTransactions / samples[0].samplePeriodSecs;
      console.log(`Current TPS ${tps}`);
      return tps < THRESHOLD;
    } catch {
      return false;
    }
  };
  return useRequest(fn, { pollingInterval: 5_000 });
};
