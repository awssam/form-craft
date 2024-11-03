import { FormFieldProps } from "@/types/common";
import React from "react";
import withResponsiveWidthClasses from "./withResponsiveWidthClasses";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import FormLabel from "./FormLabel";
import { useFormConfigStore } from "@/zustand/store";
import FormFieldWrapper from "./FormFieldWrapper";
import { FormMessage } from "@/components/ui/form";

const FormRadioInput = ({ field, className, control }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.inputBorderColor
  );
  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <div className={cn("flex flex-col gap-2", className)}>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup
            onValueChange={rhFormField.onChange}
            defaultValue={rhFormField.value}
            className="flex flex-wrap items-center gap-4 my-1"
          >
            {field.options?.map((option) => (
              <div
                className="flex items-center space-x-1.5"
                key={option?.value}
              >
                <RadioGroupItem
                  value={option?.value as string}
                  id={option?.label+ "-" + field.label as string}
                  style={{ borderColor: inputBorderColor }}
                />
                <FormLabel htmlFor={option?.label+ "-" + field.label as string}>
                  {option?.label}
                </FormLabel>
                <span className="sr-only">{option?.helperText}</span>
              </div>
            ))}
          </RadioGroup>
          <FormMessage />
        </div>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormRadioInput);
