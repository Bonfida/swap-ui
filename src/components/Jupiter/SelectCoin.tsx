import { useRef, useMemo, useState } from "react";
import { ButtonModal } from "../Buttons";
import { useJupiterApiContext } from "../../contexts";
import { TokenInfo } from "@solana/spl-token-registry";
import { useVirtualList } from "ahooks";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { nanoid } from "nanoid";

const Row = ({ info }: { info: TokenInfo }) => {
  return (
    <div className="flex flex-row justify-start items-center p-3 hover:bg-base-300 cursor-pointer hover:rounded-md">
      <div>
        <img src={info.logoURI} className="h-[35px]" />
      </div>
      <div className="flex flex-col ml-3">
        <span className="text-md font-bold">{info.symbol}</span>
        <span className="text-sm opacity-80">{info.name}</span>
      </div>
    </div>
  );
};

const Coin = ({ tokenInfo }: { tokenInfo: TokenInfo }) => {
  return (
    <div className="flex flex-row justify-start items-center">
      <img src={tokenInfo?.logoURI} className="h-[25px]" />
      <div className="flex flex-row items-center">
        <span className="text-lg font-bold text-white ml-4">
          {tokenInfo.symbol}
        </span>
        <ChevronDownIcon className="w-[20px] text-grey ml-2" />
      </div>
    </div>
  );
};

export const SelectCoin = ({
  tokenInfo,
  setCoin,
}: {
  tokenInfo: TokenInfo | null | undefined;
  setCoin: React.Dispatch<React.SetStateAction<TokenInfo | null | undefined>>;
}) => {
  const id = useRef(nanoid());
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const { tokenMap } = useJupiterApiContext();
  const [search, setSearch] = useState("");

  const originalList = useMemo(
    () =>
      Array.from(tokenMap.values())
        .filter(
          (e) =>
            e.address.includes(search) ||
            e.name.includes(search) ||
            e.symbol.includes(search)
        )
        .slice(0, 40),
    [search]
  );

  const [list] = useVirtualList(originalList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 70,
    overscan: 10,
  });

  if (!tokenInfo) {
    return null;
  }

  return (
    <ButtonModal
      id={`select-${id.current}`}
      buttonClass="bg-transparent border-0 hover:bg-white hover:bg-opacity-10"
      buttonText={<Coin tokenInfo={tokenInfo} />}
      modalClass="h-[50%] overflow-clip"
    >
      <input
        value={search || ""}
        onChange={(e) => setSearch(e.target.value.trim())}
        type="text"
        id="search-token"
        placeholder="Search"
        className="w-full text-xs sm:text-md input input-bordered input-info mb-3"
        spellCheck={false}
      />

      <div ref={containerRef} className="h-full min-h-[200px] overflow-scroll">
        <div ref={wrapperRef}>
          {list.map((e) => (
            <label
              key={e.index}
              htmlFor={`modal-select-${id.current}`}
              onClick={() => setCoin(e.data)}
            >
              <Row info={e.data} />
            </label>
          ))}
        </div>
      </div>
    </ButtonModal>
  );
};
