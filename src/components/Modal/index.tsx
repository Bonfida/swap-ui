import { ReactNode } from "react";

export const Modal = ({
  children,
  visible,
  setVisible,
}: {
  children: ReactNode;
  visible?: boolean;
  setVisible: (arg: boolean) => void;
}) => {
  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle"
        onChange={() => setVisible(!visible)}
        checked={visible}
      />
      {visible && (
        <div className="modal">
          <div className="modal-box">{children}</div>
        </div>
      )}
    </>
  );
};
