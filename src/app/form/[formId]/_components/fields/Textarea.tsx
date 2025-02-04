'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { ComponentProps } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import withSetDefaultValueInFormPrimitive from './withSetDefaultValueInForm';

const FormTextarea = ({ field, className, formConfig, control }: FieldProps) => {
  const theme = formConfig?.theme?.type;
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};

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
            <Textarea
              placeholder={field.placeholder}
              id={field.id}
              className={cn('focus-visible:![border-color:rgba(255,255,255,0.5)]', {
                'placeholder:text-[#7F7F7F]': theme === 'midnight-black',
                'placeholder:text-[#A1A1A1]': theme === 'deep-space',
                'placeholder:text-[#8C8C8C]': theme === 'charcoal-black',
                'placeholder:text-[#A77BCA]': theme === 'deep-violet',
                'placeholder:text-[#BDC3C7]': theme === 'night-sky',
              })}
              style={{ color: primaryTextColor, borderColor: inputBorderColor }}
              {...rhFormField}
              defaultValue={field?.defaultValue as string}
            />
          </FormControl>
          <FormMessage style={{ color: secondaryTextColor }}>{field?.helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default withSetDefaultValueInFormPrimitive(withResponsiveWidthClasses(FormTextarea));
