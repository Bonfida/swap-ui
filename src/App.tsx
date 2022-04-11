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
import { useLocalStorageState } from "ahooks";
import { tokenAuthFetchMiddleware } from "@strata-foundation/web3-token-auth";
import { getToken } from "./utils/rpc";

import "react-toastify/dist/ReactToastify.css";

// Override @solana/wallet-adapter-react-ui/styles.css
import "./wallet.css";

window.Buffer = Buffer;

const App = () => {
  const [customRpc, setCustomRpc] = useLocalStorageState<string>("customRpc");

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

  const endpoint = useMemo(() => customRpc || RPC_URL, [customRpc]);

  return (
    <ConnectionProvider
      endpoint={endpoint as string}
      config={{
        fetchMiddleware: tokenAuthFetchMiddleware({
          getToken,
        }),
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <JupiterApiProvider>
          <div className="bg-neutral">
            <TopBar setCustomRpc={setCustomRpc} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-neutral">
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
