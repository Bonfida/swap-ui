import solscan from "../../assets/solscan.png";
import { abbreviate } from "../../utils/abbreviate";
import { PublicKey } from "@solana/web3.js";
import Urls from "../../settings/urls";

export const ExplorerButton = ({
  pubkey,
  tx,
}: {
  pubkey?: string | PublicKey;
  tx?: string;
}) => {
  return (
    <a
      className="flex flex-row hover:opacity-50"
      rel="noopener noreferrer"
      target="_blank"
      href={
        pubkey ? Urls.solscanAddress + pubkey?.toString() : Urls.solscanTx + tx
      }
    >
      {abbreviate(pubkey || (tx as string), 4)}
      <img src={solscan} className="h-4 mt-1 ml-1" />
    </a>
  );
};
