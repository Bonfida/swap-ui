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
  containerClass,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
  buttonClass: string;
  fromColor: string;
  viaColor?: string;
  toColor: string;
  disabled?: boolean;
  containerClass?: string;
}) => {
  return (
    <div
      className={clsx(
        "rounded-[10px] bg-gradient-to-r p-[2px]",
        `from-${fromColor}`,
        viaColor ? `via-${viaColor}` : undefined,
        `to-${toColor}`,
        containerClass,
        "animate-gradient-x"
      )}
    >
      <button
        onClick={onClick}
        type="button"
        disabled={!!disabled}
        className={clsx(
          "w-full h-full rounded-[9px]",
          buttonClass,
          disabled ? "cursor-not-allowed" : undefined
        )}
      >
        {children}
      </button>
    </div>
  );
};
