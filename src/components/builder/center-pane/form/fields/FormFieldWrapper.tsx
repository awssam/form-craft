import { FormControl, FormField } from '@/components/ui/form';
import { debounce } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import { useFieldVisibilityStore, useFormConfigStore, useSelectedFieldStore } from '@/zustand/store';
import React, { useEffect, useRef } from 'react';
import { ControllerRenderProps, FieldValues, useFormContext } from 'react-hook-form';

interface FormFieldWrapperProps extends FormFieldProps {
  render: (rhFormField: ControllerRenderProps<FieldValues, string>) => React.ReactElement;
}

const FormFieldWrapper = ({ control, field, render }: FormFieldWrapperProps) => {
  const formState = useFormContext();
  const { setValue } = formState;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateFormField = useFormConfigStore((s) => s.updateFormField);
  const updateSelectedField = useSelectedFieldStore((s) => s.updateSelectedField);
  const fieldVisibilityMap = useFieldVisibilityStore((s) => s.fields);
  const formFieldValue = formState.watch(field?.name);

  useEffect(() => {
    if (field?.defaultValue && !Array.isArray(field?.defaultValue)) {
      setValue(field.name, field?.defaultValue, { shouldValidate: true });
    }
  }, [field?.defaultValue, field.name, setValue]);

  useEffect(() => {
    if (!formFieldValue) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const value = { value: formFieldValue };
      updateFormField(field?.id!, value);
      updateSelectedField(value, true);
    }, 1000);
  }, [formFieldValue]);

  if (fieldVisibilityMap?.[field?.id!] === false) {
    return null;
  }

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation as any}
      render={({ field: rhFormField }) => <FormControl>{render(rhFormField)}</FormControl>}
    />
  );
};

export default FormFieldWrapper;
