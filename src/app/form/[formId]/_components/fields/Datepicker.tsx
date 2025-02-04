'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { ComponentProps } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DateTimePicker } from '@/components/ui/datepicker';
import { useFormContext } from 'react-hook-form';
import withSetDefaultValueInFormPrimitive from './withSetDefaultValueInForm';

const FormDatePickerField = ({ field, className, formConfig, control }: FieldProps) => {
  const theme = formConfig?.theme?.type;
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};

  const { setValue } = useFormContext();

  const getDatePickerValue = (formValue: Date | string | string[] | undefined) => {
    if (!formValue && !field?.defaultValue) return undefined;

    if (!formValue) {
      return typeof field?.defaultValue !== 'object'
        ? new Date(field?.defaultValue as string)
        : (field?.defaultValue as Date);
    }

    return typeof formValue === 'string' ? new Date(formValue) : (formValue as Date);
  };

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation as ComponentProps<typeof FormField>['rules']}
      render={({ field: rhFormField }) => (
        <FormItem className={cn('flex flex-col gap-2 space-y-0', className, 'hover:bg-transparent')}>
          <Label htmlFor={field?.id} className="flex text-xs md:text-[12px]" style={{ color: primaryTextColor }}>
            <span className="relative">
              {field.label}
              {field?.validation?.custom?.required?.value && (
                <sup className="absolute top-[-0.2em] right-[-8px] ml-[1px] font-bold text-red-500 text-sm inline">
                  *
                </sup>
              )}
            </span>
          </Label>
          <FormControl>
            <DateTimePicker
              granularity="day"
              style={{ color: primaryTextColor, borderColor: inputBorderColor }}
              value={getDatePickerValue(rhFormField?.value)}
              onChange={(d) => setValue(field?.name, d, { shouldValidate: true })}
              placeholder={field.placeholder ?? 'Pick a date'}
              placeHolderClasses={cn({
                'text-[#7F7F7F]': theme === 'midnight-black',
                'text-[#A1A1A1]': theme === 'deep-space',
                'text-[#8C8C8C]': theme === 'charcoal-black',
                'text-[#A77BCA]': theme === 'deep-violet',
                'text-[#BDC3C7]': theme === 'night-sky',
              })}
            />
          </FormControl>
          <FormMessage style={{ color: secondaryTextColor }}>{field?.helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default withSetDefaultValueInFormPrimitive(withResponsiveWidthClasses(FormDatePickerField));
