import { ReactNode } from "react";
import clsx from "clsx";

export const Link = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <a
      className={clsx(className, "underline")}
      rel="noopener noreferrer"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};
