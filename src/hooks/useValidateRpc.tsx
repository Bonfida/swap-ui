import { useRequest } from "ahooks";
import { validateUrl } from "../utils/rpc";

export const useValidateRpc = (url: string) => {
  const fn = async () => {
    return await validateUrl(url);
  };
  return useRequest(fn, { refreshDeps: [url] });
};
