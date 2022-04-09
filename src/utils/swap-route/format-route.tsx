import { InlineResponseDefaultMarketInfos } from "@jup-ag/api";

export const formatRoute = (route: InlineResponseDefaultMarketInfos[]) => {
  let str = "";
  for (let i = 0; i < route.length; i++) {
    if (i !== 0) {
      str += " ";
    }
    if (i < route.length - 1) {
      str += `${route[i].label} x`;
    } else {
      str += route[i].label;
    }
  }
  return str;
};
