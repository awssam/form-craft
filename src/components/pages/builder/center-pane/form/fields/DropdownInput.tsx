import { FormFieldProps } from '@/types/common';
import React, { useEffect, useMemo } from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { cn } from '@/lib/utils';
import { useFormConfigStore } from '@/zustand/store';
import FormFieldWrapper from './FormFieldWrapper';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';
import { Combobox, Option } from '@/components/ui/combobox';
import { useFormContext } from 'react-hook-form';
import EditableHelperText from './EditableHelperText';

const FormDropdownInput = ({ field, className, control, isOverlay }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);
  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);

  const [values, setValues] = React.useState<Option[]>([]);

  const { setValue } = useFormContext();

  const handleChange = (values: Option[]) => {
    setValue(field.name, Array.from(new Set(values.map((d) => d.value))), { shouldValidate: true });
  };

  const fieldDefaultValueString = useMemo(() => JSON.stringify(field?.defaultValue), [field?.defaultValue]);
  const fieldValueString = useMemo(() => JSON.stringify(field?.value), [field?.value]);

  // To keep the selected state in sync with the default value
  useEffect(() => {
    if (fieldDefaultValueString) {
      const selected = field?.options?.filter((d) =>
        JSON.parse(fieldDefaultValueString)?.includes(d.value),
      ) as Option[];
      setValues(selected);
      setValue(field.name, JSON.parse(fieldDefaultValueString));
    }
  }, [fieldDefaultValueString, field.name, setValue, field?.options]);

  // doing it this way to keep be able to automatically reset from config pane when allowMultiSelect is changed.
  useEffect(() => {
    if (fieldValueString) {
      const selected = field?.options?.filter((d) => JSON.parse(fieldValueString)?.includes(d.value)) as Option[];
      setValues(selected);
    }
  }, [fieldValueString, field?.name, field?.options]);

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <DraggableFieldWrapper id={field?.id} isOverlay={isOverlay} className={className}>
          {({ style: styles, listeners, attributes, setActivatorNodeRef, setNodeRef, className: wrapperClassName }) => {
            return (
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

                <Combobox
                  placeholder={field?.placeholder ?? 'Select an option...'}
                  allowMultiple={field?.allowMultiSelect}
                  options={field.options as Option[]}
                  selectedValues={values}
                  handleChange={(values) => {
                    rhFormField?.onChange(values?.map((d) => d.value));
                    handleChange(values);
                  }}
                  triggerStyle={{ borderColor: inputBorderColor, color: primaryColor }}
                  placeholderClassName={cn('focus-visible:![border-color:rgba(255,255,255,0.5)]', {
                    'text-[#7F7F7F]': theme === 'midnight-black',
                    'text-[#A1A1A1]': theme === 'deep-space',
                    'text-[#8C8C8C]': theme === 'charcoal-black',
                    'text-[#A77BCA]': theme === 'deep-violet',
                    'text-[#BDC3C7]': theme === 'night-sky',
                  })}
                />
                <EditableHelperText field={field} />
              </div>
            );
          }}
        </DraggableFieldWrapper>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormDropdownInput);
