"use client";

import React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GenericProps } from "@/types/common";

export type Option = {
  value: string;
  label: string;
};



interface ComboboxProps extends GenericProps {
  options: Option[];
  allowMultiple?: boolean;
  selectedValues?: Option[];
  handleChange?: (values: Option[]) => void;
}

export function Combobox({ options: _options, allowMultiple, selectedValues = [], handleChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState<Option[]>(selectedValues);
  const [popupWidth, setPopupWidth] = React.useState(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const handleSelect = (currentValue: string) => {
    if (allowMultiple) {
      const selected = _options.find((option) => option.value === currentValue) as Option;
      const updated = values?.find(d => d.value === currentValue) ? values?.filter((d) => d.value !== currentValue) : [...values, selected];
      setValues(updated);
      handleChange?.(updated);
    } else {
      const updated = _options.find((option) => option.value === currentValue) as Option;
      setValues([updated]);
      handleChange?.([updated]);
      setOpen(false);
    }
  };

  React.useLayoutEffect(() => {
    if (open) {
      setPopupWidth(buttonRef.current?.getBoundingClientRect()?.width || 0);
    }
  }, [open]);

  const label = (
    <span>
      {values[0]?.label}{" "}
      {allowMultiple ? (
        values.length > 1 ? (
          <span className="text-muted-foreground text-xs">{` +${
            values.length - 1
          } more`}</span>
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {values.length > 0 ? label : "Select..."}
          <CaretSortIcon className="opacity-50 ml-2 w-4 h-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: popupWidth }} className={cn("p-0")}>
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>Nothing Found.</CommandEmpty>
            <CommandGroup>
              {_options?.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      values?.find((v) => v.value === option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
