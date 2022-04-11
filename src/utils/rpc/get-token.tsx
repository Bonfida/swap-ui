import axios from "axios";
import { GEN_GO_TOKEN } from "../../settings/rpc";

export const getToken = async (): Promise<string> => {
  const { data } = await axios.get(GEN_GO_TOKEN as string);
  return data.access_token as string;
};
