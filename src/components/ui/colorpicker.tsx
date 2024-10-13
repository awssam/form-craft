"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  showLabel?: boolean;
  className?: string;
  triggerClassName?: string;
}

const ColorPicker = ({
  color,
  onChange,
  showLabel = false,
  className,
  triggerClassName,
}: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger  className={cn("flex flex-col items-center w-10", triggerClassName)}>
        <div
          title={color}
          className={cn("shadow-md rounded-md w-8 h-8 transition-colors min-w-6 min-h-6 border border-[#484848]", className)}
          style={{ backgroundColor: color }}
        />
        {showLabel && <input className="bg-transparent mx-2 border-none max-w-14 text-foreground text-xs outline-none" value={color} onChange={(e) => onChange(e.target.value)} />}
      </PopoverTrigger>

      <PopoverContent align="start" alignOffset={15} className="p-0">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
