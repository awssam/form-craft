import { FormFieldProps } from '@/types/common';
import React from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import FormLabel from './FormLabel';
import { useFormConfigStore } from '@/zustand/store';
import FormFieldWrapper from './FormFieldWrapper';
import { FormMessage } from '@/components/ui/form';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';

const FormRadioInput = ({ field, className, control, isOverlay }: FormFieldProps) => {
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);
  const secondaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.secondaryTextColor);

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
                    <FormLabel htmlFor={(option?.label + '-' + field.label) as string}>{option?.label}</FormLabel>
                    <span className="sr-only">{option?.helperText}</span>
                  </div>
                ))}
              </RadioGroup>
              <FormMessage style={{ color: secondaryColor }}>{field?.helperText}</FormMessage>
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormRadioInput);
