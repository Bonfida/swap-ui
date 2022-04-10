import { ReactNode, useRef } from "react";
import clsx from "clsx";
import { useClickAway } from "ahooks";

export const ButtonModal = ({
  children,
  buttonText,
  buttonClass,
  modalClass,
  visible,
  setVisible,
}: {
  children: ReactNode;
  buttonText: ReactNode;
  buttonClass?: string;
  modalClass?: string;
  visible?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const clickAwayRef = useRef<HTMLDivElement>(null);

  useClickAway(
    () => {
      setVisible(false);
    },
    clickAwayRef,
    "mousedown"
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setVisible(true)}
        className={clsx("btn modal-button", buttonClass)}
      >
        {buttonText}
      </button>
      <input
        type="checkbox"
        className="modal-toggle"
        onChange={() => setVisible((prev) => !prev)}
        checked={visible}
      />
      {visible && (
        <div className="modal ">
          <div
            className={clsx("modal-box relative", modalClass)}
            ref={clickAwayRef}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};
