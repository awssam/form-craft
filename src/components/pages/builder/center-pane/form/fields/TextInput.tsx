import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import withResponsiveWidthClasses from './withResponsiveWidthClasses';
import { FormFieldProps } from '@/types/common';
import { useFormConfigStore } from '@/zustand/store';
import FormFieldWrapper from './FormFieldWrapper';
import FormFieldLabelAndControls from './FormFieldLabelAndControls';
import DraggableFieldWrapper from './DraggableFieldWrapper';
import EditableHelperText from './EditableHelperText';

const FormTextInput = ({ field, control, className, isOverlay = false }: FormFieldProps) => {
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);

  const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);
  const inputBorderColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.inputBorderColor);

  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <DraggableFieldWrapper id={field?.id} isOverlay={isOverlay} className={className}>
          {({ style: styles, listeners, attributes, setActivatorNodeRef, setNodeRef, className: wrapperClassName }) => (
            <div
              id={isOverlay ? `overlay-${field?.id}` : field?.id}
              ref={setNodeRef}
              style={styles}
              className={cn(
                'flex flex-col gap-2 hover:bg-yellow-200/10 py-3 px-2 rounded-lg transition-colors duration-200',
                wrapperClassName,
              )}
            >
              <FormFieldLabelAndControls
                field={field}
                listeners={listeners}
                attributes={attributes}
                setActivatorNodeRef={setActivatorNodeRef}
                isDragging={isOverlay}
              />
              <Input
                placeholder={field.placeholder}
                id={field.id}
                className={cn('focus-visible:![border-color:rgba(255,255,255,0.5)]', {
                  'placeholder:text-[#7F7F7F]': theme === 'midnight-black',
                  'placeholder:text-[#A1A1A1]': theme === 'deep-space',
                  'placeholder:text-[#8C8C8C]': theme === 'charcoal-black',
                  'placeholder:text-[#A77BCA]': theme === 'deep-violet',
                  'placeholder:text-[#BDC3C7]': theme === 'night-sky',
                })}
                style={{ color: primaryColor, borderColor: inputBorderColor }}
                {...rhFormField}
                value={rhFormField.value ?? field?.defaultValue ?? ''}
              />
              <EditableHelperText field={field} />
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};

export default withResponsiveWidthClasses(FormTextInput);
