'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { ComponentProps } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const FormRadioField = ({ field, className, formConfig, control }: FieldProps) => {
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation as ComponentProps<typeof FormField>['rules']}
      render={({ field: rhFormField }) => (
        <FormItem className={cn('flex flex-col gap-2 space-y-0', className)}>
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
            <RadioGroup
              onValueChange={rhFormField.onChange}
              value={rhFormField.value ?? (field?.defaultValue as string)}
              className="flex flex-wrap items-center gap-4 my-1"
            >
              {field.options?.map((option, index) => (
                <div className="flex items-center space-x-1.5" key={index}>
                  <RadioGroupItem
                    value={option?.value as string}
                    id={(option?.label + '-' + field.label) as string}
                    style={{ borderColor: inputBorderColor }}
                  />
                  <Label htmlFor={(option?.label + '-' + field.label) as string} style={{ color: primaryTextColor }}>
                    {option?.label}
                  </Label>
                  <span className="sr-only">{option?.helperText}</span>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage style={{ color: secondaryTextColor }}>{field?.helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormRadioField);
