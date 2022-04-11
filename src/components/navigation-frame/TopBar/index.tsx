import {
  WalletMultiButton,
  WalletDisconnectButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSmallScreen } from "../../../hooks";
import { Logo } from "./Logo";
import { RpcSettings } from "../../RpcSettings";

const TopBar = ({ setCustomRpc }: { setCustomRpc: (url: string) => void }) => {
  const { connected } = useWallet();
  const smallScreen = useSmallScreen();
  if (smallScreen) {
    return (
      <div className="relative h-[40px] bg-neutral mb-8">
        <div className="absolute top-5 left-4">
          <Logo />
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-[40px] bg-neutral mb-10">
      <div className="absolute top-5 left-4">
        <Logo />
      </div>
      <div className="absolute flex flex-row mt-3 top-3 right-4">
        <RpcSettings setCustomRpc={setCustomRpc} />
        <WalletModalProvider>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </WalletModalProvider>
      </div>
    </div>
  );
};

export default TopBar;
