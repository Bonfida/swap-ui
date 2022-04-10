import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  BloctoWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletWalletAdapter,
  SolongWalletAdapter,
  Coin98WalletAdapter,
  CloverWalletAdapter,
  TorusWalletAdapter,
  MathWalletAdapter,
  SlopeWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ToastContainer, toast } from "react-toastify";
import Footer from "./components/navigation-frame/Footer";
import TopBar from "./components/navigation-frame/TopBar";
import { RPC_URL } from "./settings/rpc";
import { JupiterApiProvider } from "./contexts";
import { Buffer } from "buffer";
import JupiterForm from "./components/Jupiter";

import "react-toastify/dist/ReactToastify.css";
// Default styles that can be overridden by your app
// import "@solana/wallet-adapter-react-ui/styles.css";
import "./wallet.css";

window.Buffer = Buffer;

const App = () => {
  const network = WalletAdapterNetwork.Mainnet;
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new SolongWalletAdapter(),
      new MathWalletAdapter(),
      new Coin98WalletAdapter(),
      new CloverWalletAdapter(),
      new BloctoWalletAdapter({ network }),
    ],
    [network]
  );

  const endpoint = useMemo(() => RPC_URL, []);

  return (
    <ConnectionProvider endpoint={endpoint as string}>
      <WalletProvider wallets={wallets} autoConnect>
        <JupiterApiProvider>
          <div className="bg-neutral">
            <TopBar />
            <div className="min-h-screen flex flex-col justify-center items-center bg-neutral">
              <JupiterForm />
            </div>
            <Footer />
          </div>
        </JupiterApiProvider>
      </WalletProvider>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </ConnectionProvider>
  );
};

export default App;
