"use client";

import { cn } from "@/lib/utils";
import React from "react";

type Props<T> = {
  options: T[];
  selectedOption: T;
  setSelectedOption: React.Dispatch<React.SetStateAction<T>>;
};

const MobileSectionDisplayer = <T,>(props: Props<T>) => {
  const { options, selectedOption, setSelectedOption } = props;


  const renderOption = (option: T, className: string) => (
    <span
      key={option?.toString()}
      onClick={() => setSelectedOption(option)}
      className={cn(
        "px-3 py-2.5 cursor-pointer font-semibold text-foreground text-xs transition-all duration-300",
        className
      )}
    >
      {option?.toString()}
    </span>
  );

  return (
    <div className="bottom-10 left-1/2 fixed flex items-center border-greyBorder md:hidden bg-[#242428] rounded-2xl max-w-[90vw] h-full max-h-min -translate-x-1/2">
      {options?.map((option, index) => {
        if (index === 0)
          return renderOption(
            option,
            cn(
              "px-4 py-2.5 rounded-l-2xl",
              selectedOption === option ? "bg-black" : ""
            )
          );
        if (index === options.length - 1)
          return renderOption(
            option,
            cn(
              "px-4 py-2.5 rounded-r-2xl",
              selectedOption === option ? "bg-black" : ""
            )
          );

        return renderOption(
          option,
          cn(selectedOption === option ? "bg-black" : "")
        );
      })}
    </div>
  );
};

export default MobileSectionDisplayer;
