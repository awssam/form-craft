import { FormControl, FormField } from "@/components/ui/form";
import { FormFieldProps } from "@/types/common";
import React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface FormFieldWrapperProps extends FormFieldProps {
  render: (
    rhFormField: ControllerRenderProps<FieldValues, string>
  ) => React.ReactElement;
}

const FormFieldWrapper = ({
  control,
  field,
  render,
}: FormFieldWrapperProps) => {
  return (
    <FormField
      control={control}
      name={field?.id}
      rules={field?.validation}
      render={({ field: rhFormField }) => (
        <FormControl>{render(rhFormField)}</FormControl>
      )}
    />
  );
};

export default FormFieldWrapper;
