import {
  WalletMultiButton,
  WalletDisconnectButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSmallScreen } from "../../hooks";

const TopBar = () => {
  const { connected } = useWallet();
  const smallScreen = useSmallScreen();
  if (smallScreen) {
    return null;
  }
  return (
    <div className="relative h-[40px] bg-neutral">
      <div className="absolute mt-3 top-3 right-4">
        <WalletModalProvider>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </WalletModalProvider>
      </div>
    </div>
  );
};

export default TopBar;
