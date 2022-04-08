import { ReactNode } from "react";
import clsx from "clsx";

export const ButtonBorderGradient = ({
  onClick,
  children,
  buttonClass,
  fromColor,
  viaColor,
  toColor,
  disabled,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
  buttonClass: string;
  fromColor: string;
  viaColor?: string;
  toColor: string;
  disabled?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "rounded-[10px] bg-gradient-to-r p-[1.5px]",
        `from-${fromColor}`,
        viaColor ? `via-${viaColor}` : undefined,
        `to-${toColor}`
      )}
    >
      <button
        onClick={onClick}
        type="button"
        disabled={!!disabled}
        className={clsx("w-full h-full rounded-[8.5px]", buttonClass)}
      >
        {children}
      </button>
    </div>
  );
};
