'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { ComponentProps, useEffect, useMemo } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';

const FormCheckboxField = ({ field, className, formConfig, control, formValuesByPageMap, pageId }: FieldProps) => {
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};
  const formState = useFormContext();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const { setValue } = formState;
  const fieldDefaultValueString = useMemo(() => JSON.stringify(field?.defaultValue), [field?.defaultValue]);
  const fieldUserFilledValueString = useMemo(
    () => JSON.stringify(formValuesByPageMap?.[pageId]?.[field?.name]),
    [field?.name, formValuesByPageMap, pageId],
  );

  // To keep the selected state in sync with the default value

  useEffect(() => {
    if (fieldDefaultValueString && !fieldUserFilledValueString) {
      setSelected(new Set(JSON.parse(fieldDefaultValueString)));
      setValue(field.name, JSON.parse(fieldDefaultValueString), { shouldValidate: true });
    }
    if (fieldUserFilledValueString) {
      setSelected(new Set(JSON.parse(fieldUserFilledValueString)));
      setValue(field.name, JSON.parse(fieldUserFilledValueString), { shouldValidate: true });
    }
  }, [fieldDefaultValueString, field.name, setValue, fieldUserFilledValueString]);

  const handleCheckboxChange = (checked: boolean, value: string) => {
    const newSelected = new Set(selected);

    if (checked) newSelected.add(value);
    else newSelected.delete(value);

    setSelected(newSelected);

    setValue(field.name, Array.from(newSelected), { shouldValidate: true });
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
            <div className="flex flex-wrap items-center gap-4 my-1">
              {field.options?.map((option, index) => (
                <div className="flex items-center space-x-1.5" key={index}>
                  <Checkbox
                    value={option?.value as string}
                    checked={selected.has(option?.value as string)}
                    onCheckedChange={(e) => {
                      rhFormField.onChange(e);
                      handleCheckboxChange(!!e, option?.value as string);
                    }}
                    id={(option?.label + '-' + field.label) as string}
                    style={{ borderColor: inputBorderColor }}
                    color={primaryTextColor}
                  />
                  <Label htmlFor={(option?.label + '-' + field.label) as string} style={{ color: primaryTextColor }}>
                    {option?.label}
                  </Label>
                  <span className="sr-only">{option?.helperText}</span>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage style={{ color: secondaryTextColor }}>{field?.helperText}</FormMessage>
        </FormItem>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormCheckboxField);
