import React from 'react';
import FormLabel from './FormLabel';
import { Grip, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import { useSelectedFieldStore } from '@/zustand/store';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';

const FormFieldLabelAndControls = ({ field }: Pick<FormFieldProps, 'field'>) => {
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);
  const { setSection, FORMSECTIONS } = useFormSectionDisplay();

  const handleFieldSettingsClick = () => {
    setSelectedField(field);
    setSection(FORMSECTIONS.Settings);
  };

  return (
    <div className="flex gap-3 items-center justify-between break-all break-words">
      <FormLabel htmlFor={field?.id} className="relative flex">
        <span>{field.label}</span>
        <span className="sr-only">{field?.helperText}</span>
        {field?.validation?.custom?.required?.value && (
          <sup className="top-[-0.1em] ml-[1px] font-bold text-red-500 text-sm">*</sup>
        )}
      </FormLabel>
      <div className="flex gap-1 items-center cursor-pointer transition-all duration-200">
        <Settings
          className="hover:opacity-60 w-4 min-w-4 h-4 min-h-4 text-[#b6a2a2] cursor-pointer opacity-100 md:opacity-20 group-hover:opacity-100 hover:scale-125"
          onClick={handleFieldSettingsClick}
        />
        <Grip
          className={cn(
            'w-4 min-w-4 h-4 min-h-4 text-[#b6a2a2] cursor-grab focus:outline-none opacity-100 md:opacity-20 group-hover:opacity-100 hover:scale-125',
          )}
        />
      </div>
    </div>
  );
};

export default FormFieldLabelAndControls;
