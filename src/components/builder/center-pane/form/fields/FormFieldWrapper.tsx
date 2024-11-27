import { FormControl, FormField } from '@/components/ui/form';
import { FormFieldProps } from '@/types/common';
import React, { useEffect } from 'react';
import { ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';

interface FormFieldWrapperProps extends FormFieldProps {
  render: (rhFormField: ControllerRenderProps<FieldValues, string>) => React.ReactElement;
}

const FormFieldWrapper = ({ control, field, render }: FormFieldWrapperProps) => {
  const formState = useFormContext();
  const { setValue } = formState;

  useEffect(() => {
    if (field?.defaultValue && !Array.isArray(field?.defaultValue)) {
      setValue(field.name, field?.defaultValue, { shouldValidate: true });
    }
  }, [field?.defaultValue, field.name, setValue]);

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation}
      render={({ field: rhFormField }) => <FormControl>{render(rhFormField)}</FormControl>}
    />
  );
};

export default FormFieldWrapper;
