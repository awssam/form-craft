import { Input } from '@/components/ui/input';
import { cn, debounce } from '@/lib/utils';
import React from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { FormFieldProps } from '@/types/common';
import FormLabel from './FormLabel';
import { useFormConfigStore } from '@/zustand/store';
import FormFieldWrapper from './FormFieldWrapper';
import { FormMessage } from '@/components/ui/form';

const FormTextInput = ({ field, control, className }: FormFieldProps) => {
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);

  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);
  const secondaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.secondaryTextColor);
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <div className={cn('flex flex-col gap-2', className)}>
          <FormLabel>{field.label}</FormLabel>
          <Input
            placeholder={field.placeholder}
            id={field.id}
            className={cn({
              'placeholder:text-[#7F7F7F]': theme === 'midnight-black',
              'placeholder:text-[#A1A1A1]': theme === 'deep-space',
              'placeholder:text-[#8C8C8C]': theme === 'charcoal-black',
              'placeholder:text-[#A77BCA]': theme === 'deep-violet',
              'placeholder:text-[#BDC3C7]': theme === 'night-sky',
            })}
            style={{ color: primaryColor, borderColor: inputBorderColor }}
            {...rhFormField}
            value={rhFormField.value ?? field?.defaultValue ?? ''}
          />
          <FormMessage style={{ color: secondaryColor }}>{field?.helperText}</FormMessage>
        </div>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormTextInput);
