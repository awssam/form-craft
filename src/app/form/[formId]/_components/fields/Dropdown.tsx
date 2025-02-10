'use client';

import withResponsiveWidthClasses from '@/app/builder/_components/center-pane/form/fields/withResponsiveWidthClasses';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { FieldProps } from './FieldRenderer';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Combobox, Option } from '@/components/ui/combobox';
import { useFormContext, useWatch } from 'react-hook-form';

const FormDropdownField = ({ field, className, formConfig, control, formValuesByPageMap, pageId }: FieldProps) => {
  const [values, setValues] = useState<Option[]>([]);
  const theme = formConfig?.theme?.type;
  const { inputBorderColor, primaryTextColor, secondaryTextColor } = formConfig?.theme?.properties ?? {};
  const { setValue } = useFormContext();

  const fieldDefaultValueString = useMemo(() => JSON.stringify(field?.defaultValue), [field?.defaultValue]);
  const fieldUserFilledValueString = useMemo(
    () => JSON.stringify(formValuesByPageMap?.[pageId]?.[field?.name]),
    [field?.name, formValuesByPageMap, pageId],
  );

  const fieldWatcher = useWatch({ control, name: field.name });

  useEffect(() => {
    if (fieldWatcher) {
      const selected = field?.options?.filter((d) => fieldWatcher.includes(d.value)) as Option[];
      setValues(selected);
    }
  }, [field.name, fieldWatcher, field?.options]);

  // To keep the selected state in sync with the default value
  useEffect(() => {
    if (fieldDefaultValueString && !fieldUserFilledValueString) {
      const selected = field?.options?.filter((d) =>
        JSON.parse(fieldDefaultValueString)?.includes(d.value),
      ) as Option[];
      setValues(selected);
      setValue(field.name, JSON.parse(fieldDefaultValueString));
    }
    if (fieldUserFilledValueString) {
      const selected = field?.options?.filter((d) =>
        JSON.parse(fieldUserFilledValueString)?.includes(d.value),
      ) as Option[];
      setValues(selected);
      setValue(field.name, JSON.parse(fieldUserFilledValueString));
    }
  }, [fieldDefaultValueString, field.name, setValue, field?.options, fieldUserFilledValueString]);

  const handleChange = (values: Option[]) => {
    setValue(field.name, Array.from(new Set(values.map((d) => d.value))), { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name={field?.name}
      rules={field?.validation as ComponentProps<typeof FormField>['rules']}
      render={({ field: rhFormField }) => (
        <FormItem className={cn('flex flex-col gap-4 space-y-0', className, 'hover:bg-transparent')}>
          <Label htmlFor={field?.id} className="flex text-sm font-semibold md:text-[12px]">
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
            <Combobox
              placeholder={field?.placeholder ?? 'Select an option...'}
              allowMultiple={field?.allowMultiSelect}
              options={field.options as Option[]}
              selectedValues={values}
              handleChange={(values) => {
                rhFormField?.onChange(values?.map((d) => d.value));
                handleChange(values);
              }}
              triggerStyle={{ color: primaryTextColor, borderColor: inputBorderColor }}
              placeholderClassName={cn('focus-visible:![border-color:rgba(255,255,255,0.5)]', {
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

export default withResponsiveWidthClasses(FormDropdownField);
