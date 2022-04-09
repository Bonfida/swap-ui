import { InlineResponseDefaultMarketInfos } from "@jup-ag/api";
import { TokenInfo } from "@solana/spl-token-registry";

export const formatTokens = (
  tokenMap: Map<string, TokenInfo>,
  route: InlineResponseDefaultMarketInfos[]
) => {
  let str = "";
  for (let i = 0; i < route.length; i++) {
    const inputMint = route[i].inputMint;
    const outputMint = route[i].outputMint;
    if (!inputMint || !outputMint) {
      // Don't think this can happen in practice?
      throw new Error("Unknown token");
    }
    if (i !== 0) {
      str += " ";
    }
    if (i < route.length - 1) {
      str += `${tokenMap.get(inputMint)?.symbol} →`;
    } else {
      str += `${tokenMap.get(inputMint)?.symbol} → ${
        tokenMap.get(outputMint)?.symbol
      }`;
    }
  }
  return str.trimStart();
};
