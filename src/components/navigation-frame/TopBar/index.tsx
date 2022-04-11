import {
  WalletMultiButton,
  WalletDisconnectButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSmallScreen, useSolanaCongested } from "../../../hooks";
import { Logo } from "./Logo";
import { RpcSettings } from "../../RpcSettings";
import { Congested } from "./Congested";
import clsx from "clsx";

const TopBar = ({ setCustomRpc }: { setCustomRpc: (url: string) => void }) => {
  const { connected } = useWallet();
  const smallScreen = useSmallScreen();
  const { data: congested } = useSolanaCongested();

  if (smallScreen) {
    return (
      <div className="relative h-[40px] bg-neutral mb-8">
        <Congested congested={!!congested} />
        <div
          className={clsx(
            "absolute left-4",
            congested ? "top-[30px]" : "top-5"
          )}
        >
          {!congested && <Logo />}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[40px] bg-neutral mb-10">
      <Congested congested={!!congested} />
      <div
        className={clsx("absolute left-4", congested ? "top-[30px]" : "top-5")}
      >
        <Logo />
      </div>
      <div
        className={clsx(
          "absolute flex flex-row right-4",
          congested ? "top-[30px]" : "top-3",
          congested ? undefined : "mt-3"
        )}
      >
        <RpcSettings setCustomRpc={setCustomRpc} />
        <WalletModalProvider>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </WalletModalProvider>
      </div>
    </div>
  );
};

export default TopBar;
