import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import React from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { useFormConfigStore, useUIEventsActionProperty } from '@/zustand/store';
import { FormMessage } from '@/components/ui/form';
import FormFieldWrapper from './FormFieldWrapper';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';

const TextareaInput = ({ field, className, control, isOverlay }: FormFieldProps) => {
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);
  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);
  const secondaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.secondaryTextColor);
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);

  const setIsDraggingField = useUIEventsActionProperty('setIsDraggingFormField');

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={({ value, ...rhFormField }) => (
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
              <Textarea
                onMouseDown={() => setIsDraggingField(true)}
                onMouseUp={() => setIsDraggingField(false)}
                onTouchStart={() => setIsDraggingField(true)}
                onTouchEnd={() => setIsDraggingField(false)}
                placeholder={field?.placeholder}
                id={field?.id}
                style={{ color: primaryColor, borderColor: inputBorderColor }}
                className={cn('focus-visible:![border-color:rgba(255,255,255,0.5)]', {
                  'placeholder:text-[#7F7F7F]': theme === 'midnight-black',
                  'placeholder:text-[#A1A1A1]': theme === 'deep-space',
                  'placeholder:text-[#8C8C8C]': theme === 'charcoal-black',
                  'placeholder:text-[#A77BCA]': theme === 'deep-violet',
                  'placeholder:text-[#BDC3C7]': theme === 'night-sky',
                })}
                {...rhFormField}
                value={value ?? (field?.defaultValue as string)}
              />
              <FormMessage style={{ color: secondaryColor }}>{field?.helperText}</FormMessage>
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};

export default withResponsiveWidthClasses(TextareaInput);
