import { Connection } from "@solana/web3.js";
import { RPC_GEN_URL } from "../../settings/rpc";

export const GENESYS_GO_CONNECTIONS = new Connection(RPC_GEN_URL, "processed");
