import { ReactNode, useRef } from "react";
import clsx from "clsx";
import { nanoid } from "nanoid";

export const ButtonModal = ({
  children,
  buttonText,
  buttonClass,
  modalClass,
  id,
}: {
  children: ReactNode;
  buttonText: ReactNode;
  buttonClass?: string;
  modalClass?: string;
  id?: string;
}) => {
  const ref = useRef(`modal-${id || nanoid()}`);
  return (
    <>
      <label
        htmlFor={ref.current}
        className={clsx("btn modal-button", buttonClass)}
      >
        {buttonText}
      </label>
      <input type="checkbox" id={ref.current} className="modal-toggle" />
      <label htmlFor={ref.current} className="modal cursor-pointer ">
        <label className={clsx("modal-box relative", modalClass)} htmlFor="">
          {children}
        </label>
      </label>
    </>
  );
};
