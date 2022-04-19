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
import { RPC_URL, WSS_URL } from "./settings/rpc";
import { JupiterApiProvider } from "./contexts";
import { Buffer } from "buffer";
import JupiterForm from "./components/Jupiter";
import { useLocalStorageState } from "ahooks";
import { tokenAuthFetchMiddleware } from "@strata-foundation/web3-token-auth";
import { getToken } from "./utils/rpc";
import { Warning } from "./components/Warning";

import "react-toastify/dist/ReactToastify.css";

// Override @solana/wallet-adapter-react-ui/styles.css
import "./wallet.css";

window.Buffer = Buffer;

const App = () => {
  const [customRpc, setCustomRpc] = useLocalStorageState<string>("customRpc");
  const [visible, setVisible] = useLocalStorageState<boolean>("warning", {
    defaultValue: true,
  });

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

  const endpoint = useMemo(() => customRpc || (RPC_URL as string), [customRpc]);

  const jwt = endpoint?.includes("genesysgo") || endpoint?.includes("quiknode");

  return (
    <ConnectionProvider
      endpoint={endpoint as string}
      config={{
        wsEndpoint: WSS_URL as string,
        commitment: "processed",
        fetchMiddleware: jwt
          ? tokenAuthFetchMiddleware({
              getToken,
            })
          : undefined,
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
          <Warning visible={visible} setVisible={setVisible} />
        </JupiterApiProvider>
      </WalletProvider>
      <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
    </ConnectionProvider>
  );
};

export default App;
