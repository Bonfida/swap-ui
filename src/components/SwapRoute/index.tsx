import { InlineResponseDefaultMarketInfos } from "@jup-ag/api";
import { TokenInfo } from "@solana/spl-token-registry";
import { formatTokens, formatRoute } from "../../utils/swap-route";

export const SwapRoute = ({
  selected,
  route,
  tokenMap,
}: {
  selected: boolean;
  route: InlineResponseDefaultMarketInfos[];
  tokenMap: Map<string, TokenInfo>;
}) => {
  return (
    <div className="relative bg-gradient-to-r from-green-400 to-blue-500 p-[2px] rounded-[6px]">
      {/* Badge */}
      <div className="absolute right-0 top-[-11px] bg-blue-500 text-white text-sm font-bold px-2 py-[1px] rounded-[5px]">
        Best route
      </div>

      <div className="flex flex-row items-center justify-between bg-neutral rounded-[5px] p-3">
        <div className="flex flex-col">
          <span className="font-bold text-white">{formatRoute(route)}</span>
          <span className="text-sm font-bold opacity-80">
            {formatTokens(tokenMap, route)}
          </span>
        </div>
        {/* Output amount */}
        <div></div>
      </div>
    </div>
  );
};
