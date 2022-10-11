import clsx from "clsx";
import { PropsWithChildren } from "react";

export const BoxedLayout = ({
  minStretch = "256px",
  maxStretch = "1024px",
  className,
  children,
}: PropsWithChildren<{
  minStretch?: string;
  maxStretch?: string;
  className?: string;
}>) => (
  <div
    className={clsx(
      className,
      "grid justify-center w-full overflow-x-hidden py-8 px-6 sm:px-8"
    )}
    style={{
      gridTemplateColumns: `minmax(${minStretch}, ${maxStretch})`,
    }}
  >
    {children}
  </div>
);
