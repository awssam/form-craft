import { FormFieldProps } from "@/types/common";
import React from "react";
import withResponsiveWidthClasses from "./withResponsiveWidthClasses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import FormLabel from "./FormLabel";
import { useFormConfigStore } from "@/zustand/store";

const FormRadioInput = ({ field, className }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.inputBorderColor
  );
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FormLabel>{field.label}</FormLabel>
    <RadioGroup  className="flex flex-wrap items-center gap-4 my-1">
      {field.options?.map((option) => (
        <div className="flex items-center space-x-1.5" key={option?.value}>
          <RadioGroupItem value={option?.value as string} id={option?.value as string} style={{borderColor:inputBorderColor}} />
          <FormLabel htmlFor={option?.value as string}>{option?.label}</FormLabel>
          <span className="sr-only">{option?.helperText}</span>
        </div>
      ))}
    </RadioGroup>
    </div>
  );
};

export default withResponsiveWidthClasses(FormRadioInput);
