import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "@/types/common";
import React from "react";
import withResponsiveWidthClasses from "./withResponsiveWidthClasses";
import FormLabel from "./FormLabel";
import { useFormConfigStore } from "@/zustand/store";

const CheckboxInput = ({ field, className }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.inputBorderColor
  );
  const primaryColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.primaryTextColor
  )
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FormLabel>{field.label}</FormLabel>

      <div className="flex flex-wrap items-center gap-4 my-1">
      {field.options?.map((option) => (
        <div className="flex items-center space-x-1.5" key={option?.value}>
          <Checkbox
            value={option?.value as string}
            id={option?.value as string}
            style={{borderColor: inputBorderColor}}
            color={primaryColor}
          />
          <FormLabel htmlFor={option?.value as string}>{option?.label}</FormLabel>
          <span className="sr-only">{option?.helperText}</span>
        </div>
      ))}
      </div>
    </div>
  );
};

export default withResponsiveWidthClasses(CheckboxInput);
