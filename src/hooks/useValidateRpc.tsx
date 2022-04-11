import { useRequest } from "ahooks";
import { validateUrl } from "../utils/rpc";

export const useValidateRpc = (url: string) => {
  const fn = async () => {
    if (!url) return false;
    return await validateUrl(url);
  };
  return useRequest(fn, { refreshDeps: [url] });
};
