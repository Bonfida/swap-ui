import {
  WalletMultiButton,
  WalletDisconnectButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

const TopBar = () => {
  const { connected } = useWallet();
  return (
    <div className="relative">
      <div className="absolute mt-3 top-3 right-4">
        <WalletModalProvider>
          {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
        </WalletModalProvider>
      </div>
    </div>
  );
};

export default TopBar;
