import React, { useEffect } from 'react';
import { FormFieldProps } from '@/types/common';
import { useFormConfigStore } from '@/zustand/store';
import { DateTimePicker } from '@/components/ui/datepicker';
import { cn } from '@/lib/utils';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import FormFieldWrapper from './FormFieldWrapper';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';
import { useFormContext } from 'react-hook-form';
import EditableHelperText from './EditableHelperText';

const DateInput = ({ field, className, control, isOverlay }: FormFieldProps) => {
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);

  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);

  const { setValue } = useFormContext();

  // Determine granularity based on field type
  const getGranularity = (fieldType: string): 'day' | 'minute' => {
    switch (fieldType) {
      case 'datetime':
        return 'minute';
      case 'date':
      default:
        return 'day';
    }
  };

  useEffect(() => {
    setValue(field?.name, field?.defaultValue);
  }, [field?.defaultValue, field?.name, setValue]);

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
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <DraggableFieldWrapper id={field?.id} isOverlay={isOverlay} className={className}>
          {({ style: styles, listeners, attributes, setActivatorNodeRef, setNodeRef, className: wrapperClassName }) => (
            <div
              className={cn('flex flex-col gap-2', wrapperClassName)}
              ref={setNodeRef}
              style={styles}
              id={isOverlay ? `overlay-${field?.id}` : field?.id}
            >
              <FormFieldLabelAndControls
                field={field}
                listeners={listeners}
                attributes={attributes}
                setActivatorNodeRef={setActivatorNodeRef}
                isDragging={isOverlay}
              />

              <DateTimePicker
                granularity={getGranularity(field.type)}
                style={{ color: primaryColor, borderColor: inputBorderColor }}
                value={getDatePickerValue(rhFormField?.value)}
                onChange={(d) => setValue(field?.name, d, { shouldValidate: true })}
                className={className}
                placeholder={field.placeholder ?? (field.type === 'datetime' ? 'Pick date and time' : 'Pick a date')}
                placeHolderClasses={cn({
                  'text-[#7F7F7F]': theme === 'midnight-black',
                  'text-[#A1A1A1]': theme === 'deep-space',
                  'text-[#8C8C8C]': theme === 'charcoal-black',
                  'text-[#A77BCA]': theme === 'deep-violet',
                  'text-[#BDC3C7]': theme === 'night-sky',
                })}
              />
              <EditableHelperText field={field} />
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};

export default withResponsiveWidthClasses(DateInput);
