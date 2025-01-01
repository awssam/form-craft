import EditableText from '@/components/common/EditableText';
import { FormMessage } from '@/components/ui/form';
import { FieldEntity } from '@/types/form-config';
import { useFormConfigStore, useSelectedFieldStore } from '@/zustand/store';
import React from 'react';
import { useFormState } from 'react-hook-form';

const EditableHelperText = ({ field }: { field: FieldEntity }) => {
  const { errors } = useFormState();
  const secondaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties.secondaryTextColor);

  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  const updateSelectedField = useSelectedFieldStore((s) => s.updateSelectedField);

  const updateFormField = useFormConfigStore((s) => s.updateFormField);

  if (errors[field?.name]) {
    return <FormMessage style={{ color: 'red' }} />;
  }

  const handleUpdate = (value: string) => {
    updateFormField(field?.id, {
      helperText: value,
    });
    if (selectedField?.id === field?.id) {
      updateSelectedField({
        helperText: value,
      });
    }
  };

  return (
    <EditableText
      tooltipBtnClassName="self-start w-full text-left"
      inputClassName="text-xs md:text-[12px] "
      onChange={handleUpdate}
      value={field?.helperText as string}
      renderText={(_, onClick) => (
        <FormMessage onClick={onClick} style={{ color: secondaryColor }}>
          {field?.helperText}
        </FormMessage>
      )}
    />
  );
};

export default EditableHelperText;
