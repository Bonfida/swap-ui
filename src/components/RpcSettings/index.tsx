import { useState, Fragment, useEffect } from "react";
import { CogIcon } from "@heroicons/react/solid";
import { ButtonModal, ButtonBorderGradient } from "../Buttons";
import { RPC_URL } from "../../settings/rpc";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  SelectorIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/solid";
import { useValidateRpc } from "../../hooks";
import { toast } from "react-toastify";
import clsx from "clsx";

interface IRpc {
  name: string;
  url: string;
}

const RPCS: IRpc[] = [
  { name: "Bonfida", url: RPC_URL as string },
  { name: "Serum", url: "https://solana-api.projectserum.com" },
  { name: "Custom", url: "" },
];

export const RpcSettings = ({
  setCustomRpc,
}: {
  setCustomRpc: (url: string) => void;
}) => {
  const [selected, setSelected] = useState(RPCS[0]);
  const [input, setInput] = useState("");
  const [custom, setCustom] = useState(false);
  const { data: validUrl, loading } = useValidateRpc(
    !!input ? input : selected.url
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const rpc = RPCS.find(({ url }) => input === url);
    if (!rpc) {
      setCustom(true);
      setSelected(RPCS[2]);
    } else {
      setCustom(false);
      setSelected(rpc);
    }
  }, [input, custom]);

  const handleOnChange = (e: IRpc) => {
    setSelected(e);
    setCustom(false);
    setInput(e.url);
  };

  const handleSave = () => {
    setVisible(false);
    if (validUrl) {
      setCustomRpc(custom ? input : selected.url);
      toast.info(`RPC node updated 👌`);
    }
  };

  return (
    <ButtonModal
      setVisible={setVisible}
      visible={visible}
      buttonClass="bg-black hover:bg-black btn-md mr-3"
      buttonText={<CogIcon className="w-5 text-white" />}
      modalClass="py-10"
    >
      <div>
        <h2 className="mb-2 text-lg font-bold text-white">RPC Settings</h2>

        {/* Dropdown */}
        <div className="w-full top-16">
          <Listbox value={selected} onChange={handleOnChange}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full h-[60px] py-2 pl-3 pr-10 text-left bg-neutral rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-lg font-bold">
                <span className="block truncate">{selected.name}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-lg font-bold bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-lg">
                  {RPCS.slice(0, 2).map((rpc, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        `cursor-default select-none relative py-2 pl-10 pr-4 ${
                          active
                            ? "font-bold text-black bg-[#E4E9EE]"
                            : "text-gray-900"
                        }`
                      }
                      value={rpc}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {rpc.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* Input */}
        <div className="mt-5">
          <div
            className={clsx(
              custom && "bg-gradient-to-r from-green-400 to-blue-500",
              "p-[2px] rounded-[6px] h-[50px]",
              "h-[60px]"
            )}
          >
            <input
              value={custom ? input : selected.url}
              onChange={(e) => setInput(e.target.value.trim())}
              placeholder={selected.url}
              type="text"
              className="w-full h-full p-2 text-lg font-bold rounded-[5px] bg-neutral focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center mt-4 h-[24px]">
          {!loading && !validUrl && (
            <>
              <InformationCircleIcon className="text-red-400 h-[20px] mr-4" />
              <span className="font-bold">Please enter a valid URL</span>
            </>
          )}
          {!loading && validUrl && (
            <>
              <CheckCircleIcon className="text-green-400 h-[20px] mr-4" />
              <span className="font-bold">Valid RPC Node</span>
            </>
          )}
          {loading && <progress className="w-56 progress"></progress>}
        </div>
      </div>

      <div className="mt-5">
        <ButtonBorderGradient
          buttonClass="bg-black w-full p-2 uppercase font-bold h-[50px]"
          fromColor="green-400"
          toColor="blue-500"
          onClick={handleSave}
        >
          Save
        </ButtonBorderGradient>
      </div>
    </ButtonModal>
  );
};
