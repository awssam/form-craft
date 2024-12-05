import React from 'react';
import { FormFieldProps } from '@/types/common';
import { useFormConfigStore } from '@/zustand/store';
import { DateTimePicker } from '@/components/ui/datepicker';
import { cn } from '@/lib/utils';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import FormFieldWrapper from './FormFieldWrapper';
import { FormMessage } from '@/components/ui/form';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';

const DateInput = ({ field, className, control }: FormFieldProps) => {
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
          <FormFieldLabelAndControls field={field} />

          <DateTimePicker
            granularity="day"
            style={{ color: primaryColor, borderColor: inputBorderColor }}
            value={rhFormField.value ?? field?.defaultValue}
            onChange={rhFormField.onChange}
            className={className}
            placeholder={field.placeholder ?? 'Pick a date'}
            placeHolderClasses={cn({
              'text-[#7F7F7F]': theme === 'midnight-black',
              'text-[#A1A1A1]': theme === 'deep-space',
              'text-[#8C8C8C]': theme === 'charcoal-black',
              'text-[#A77BCA]': theme === 'deep-violet',
              'text-[#BDC3C7]': theme === 'night-sky',
            })}
          />
          <FormMessage style={{ color: secondaryColor }}>{field?.helperText}</FormMessage>
        </div>
      )}
    />
  );
};

export default withResponsiveWidthClasses(DateInput);
