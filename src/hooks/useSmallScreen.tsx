import { useWindowSize } from "./useWindowSize";

export const useSmallScreen = (breakpoint: number | string = "sm") => {
  const { width } = useWindowSize();

  if (typeof breakpoint === "number") {
    return width < breakpoint;
  }
  switch (breakpoint) {
    case "xs":
      return width < 600;
    case "sm":
      return width < 960;
    case "md":
      return width < 1280;
    case "lg":
      return width < 1920;
    default:
      return width < 960;
  }
};
