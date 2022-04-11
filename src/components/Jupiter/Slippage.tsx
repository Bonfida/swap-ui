import { useState } from "react";
import { ButtonModal, ButtonBorderGradient } from "../Buttons";
import { AdjustmentsIcon, InformationCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";

const OPTIONS = [1, 5, 10];

export const Slippage = ({
  slippage,
  setSlippage,
}: {
  slippage: number;
  setSlippage: (arg: number) => void;
}) => {
  const [input, setInput] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  const custom = !OPTIONS.includes(input || -1);

  const canSubmit = !custom || (custom && input && input > 0 && input < 500);

  const handleSave = () => {
    input && setSlippage(input);
    setVisible(false);
  };

  return (
    <ButtonModal
      visible={visible}
      setVisible={setVisible}
      buttonClass="bg-gray-200 bg-opacity-20 hover:bg-gray-200 hover:bg-opacity-20 btn-sm"
      buttonText={
        <div className="flex flex-row items-center">
          <AdjustmentsIcon className="w-3 mr-2 rotate-90" />
          <span className="text-xs"> {slippage / 10} %</span>
        </div>
      }
    >
      <div>
        <h2 className="mb-2 text-lg font-bold text-white">Slippage settings</h2>
        <div className="flex flex-row justify-between mt-5">
          {OPTIONS.map((e) => {
            return (
              <ButtonBorderGradient
                key={`slippage-option-${e}`}
                onClick={() => setInput(e)}
                buttonClass="bg-black p-2 uppercase font-bold h-[50px] w-full"
                fromColor={input === e ? "green-400" : "none"}
                toColor="blue-500"
                containerClass="w-1/3 mx-2"
              >
                {e / 10}%
              </ButtonBorderGradient>
            );
          })}
        </div>
        <div className="mt-5">
          <div
            className={clsx(
              "relative",
              custom && "bg-gradient-to-r from-green-400 to-blue-500",
              "p-[2px] rounded-[6px] h-[50px]"
            )}
          >
            <input
              onChange={(e) => setInput(10 * parseFloat(e.target.value.trim()))}
              placeholder="0.00 %"
              value={(input || 0) / 10}
              type="number"
              max={100}
              min={0}
              className="w-full h-full pr-10 text-lg font-bold text-right rounded-[5px] bg-neutral focus:outline-none"
            />
            <span className="absolute text-lg font-bold top-3 right-5">%</span>
          </div>
        </div>
        {!canSubmit && (
          <div className="flex flex-col items-center mt-5">
            <div className="flex flex-row items-center">
              <InformationCircleIcon className="h-[15px] text-orange-300 mr-2" />
              <span className="text-sm text-white">
                Slippage must be between 0 and 50
              </span>
            </div>
          </div>
        )}
      </div>
      <ButtonBorderGradient
        onClick={handleSave}
        disabled={!canSubmit}
        containerClass="mt-5"
        buttonClass="bg-black w-full p-2 uppercase font-bold h-[50px]"
        fromColor="green-400"
        toColor="blue-500"
      >
        Save settings
      </ButtonBorderGradient>
    </ButtonModal>
  );
};
