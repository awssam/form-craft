import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "@/types/common";
import React from "react";
import withResponsiveWidthClasses from "./withResponsiveWidthClasses";
import FormLabel from "./FormLabel";
import { useFormConfigStore } from "@/zustand/store";
import FormFieldWrapper from "./FormFieldWrapper";
import { FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

const CheckboxInput = ({ field, className, control }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.inputBorderColor
  );
  const primaryColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.primaryTextColor
  );

  const formState = useFormContext();
  const { setValue } = formState;

  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const handleCheckboxChange = (checked: boolean, value: string) => {
    const newSelected = new Set(selected);

    if (checked) newSelected.add(value);
    else newSelected.delete(value);

    setSelected(newSelected);

    setValue(field.name, Array.from(newSelected), { shouldValidate: true });
  };

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <div className={cn("flex flex-col gap-2", className)}>
          <FormLabel>{field.label}</FormLabel>
          <div className="flex flex-wrap items-center gap-4 my-1">
            {field.options?.map((option) => (
              <div
                className="flex items-center space-x-1.5"
                key={option?.value}
              >
                <Checkbox
                  value={option?.value as string}
                  checked={selected.has(option?.value as string)}
                  onCheckedChange={(e) => {
                    rhFormField.onChange(e);
                    handleCheckboxChange(!!e, option?.value as string);
                  }}
                  id={(option?.label + "-" + field.label) as string}
                  style={{ borderColor: inputBorderColor }}
                  color={primaryColor}
                />
                <FormLabel
                  htmlFor={(option?.label + "-" + field.label) as string}
                >
                  {option?.label}
                </FormLabel>
                <span className="sr-only">{option?.helperText}</span>
              </div>
            ))}
          </div>
          <FormMessage />
        </div>
      )}
    />
  );
};

export default withResponsiveWidthClasses(CheckboxInput);
