import { useRef, useMemo, useState } from "react";
import { ButtonModal } from "../Buttons";
import { useJupiterApiContext } from "../../contexts";
import { TokenInfo } from "@solana/spl-token-registry";
import { useVirtualList } from "ahooks";
import { ChevronDownIcon, LinkIcon } from "@heroicons/react/solid";
import defaultCoin from "../../assets/default-coin.png";
import { Link } from "../Link";
import Urls from "../../settings/urls";

const Row = ({
  info,
  handleSelect,
}: {
  info: TokenInfo;
  handleSelect: (e: TokenInfo) => void;
}) => {
  return (
    <button
      type="button"
      className="flex flex-row items-center justify-between w-full p-3 cursor-pointer hover:bg-base-300 hover:rounded-md"
    >
      <div
        onClick={() => handleSelect(info)}
        className="flex flex-row items-center w-full h-full"
      >
        <div>
          <img
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultCoin;
            }}
            src={info.logoURI}
            className="h-[35px] w-[35px]"
          />
        </div>
        <div className="flex flex-col items-start ml-3">
          <span className="font-bold text-md">{info.symbol}</span>
          <span className="text-sm opacity-80">{info.name}</span>
        </div>
      </div>
      <Link className="btn z-1" href={Urls.solscanAddress + info.address}>
        <LinkIcon className="h-[20px]" />
      </Link>
    </button>
  );
};

const Coin = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  return (
    <div className="flex flex-row items-center justify-start">
      <img
        src={tokenInfo?.logoURI}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = defaultCoin;
        }}
        className="h-[25px] w-[25px]"
      />
      <div className="flex flex-row items-center">
        <span className="ml-4 text-lg font-bold text-white">
          {tokenInfo.symbol}
        </span>
        <ChevronDownIcon className="w-[20px] text-grey ml-2" />
      </div>
    </div>
  );
};

const TOP_COINS = [
  "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp", // FIDA
  "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt", // SRM
  "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E", // BTC
  "So11111111111111111111111111111111111111112", // wSOL
  "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R", // RAY
  "MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac", // Mango
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
];

const TopCoin = ({
  token,
  handleSelect,
}: {
  token: TokenInfo;
  handleSelect: (e: TokenInfo) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => handleSelect(token)}
      className="m-1 flex flex-row p-2 border border-[#E4E9EE] rounded-[5px] border-opacity-50 hover:bg-[#E4E9EE] hover:bg-opacity-10 cursor-pointer"
    >
      <img className="w-[18px] h-[18px] mr-2" src={token.logoURI} />
      <span className="text-xs font-bold text-white">{token.symbol}</span>
    </button>
  );
};

export const SelectCoin = ({
  tokenInfo,
  setCoin,
}: {
  tokenInfo: TokenInfo | null | undefined;
  setCoin: React.Dispatch<React.SetStateAction<TokenInfo | null | undefined>>;
}) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const { tokenMap } = useJupiterApiContext();
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const originalList = useMemo(
    () =>
      Array.from(tokenMap.values()).filter(
        (e) =>
          e.address.includes(search) ||
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.symbol.toLowerCase().includes(search.toLowerCase())
      ),
    [search, tokenInfo]
  );

  const topList = originalList.filter((e) => TOP_COINS.includes(e.address));

  const [list, scrollTo] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 70,
    overscan: 10,
  });

  const handleSelect = (e: TokenInfo) => {
    setCoin(e);
    setVisible(false);
  };

  if (!tokenInfo) {
    return null;
  }

  return (
    <ButtonModal
      visible={visible}
      setVisible={setVisible}
      buttonClass="bg-transparent border-0 hover:bg-white hover:bg-opacity-10"
      buttonText={<Coin tokenInfo={tokenInfo} />}
      modalClass="h-screen overflow-clip"
    >
      <input
        value={search || ""}
        onChange={(e) => {
          setSearch(e.target.value.trim());
          scrollTo(0);
        }}
        type="text"
        id="search-token"
        placeholder="Search"
        className="w-full mb-3 text-xs font-bold sm:text-lg input input-bordered input-info"
        spellCheck={false}
      />

      <div className="flex flex-row flex-wrap justify-start">
        {topList.map((e, idx) => (
          <TopCoin
            key={`top-coin-${idx}`}
            handleSelect={handleSelect}
            token={e}
          />
        ))}
      </div>

      <div className="border-[0.5px] mt-2 border-[#E4E9EE] border-opacity-50" />

      <div
        ref={containerRef}
        className="h-full min-h-[200px] overflow-scroll overscroll-contain"
      >
        <div ref={wrapperRef}>
          {list.map((e) => (
            <Row key={e.index} info={e.data} handleSelect={handleSelect} />
          ))}
        </div>
      </div>
    </ButtonModal>
  );
};
