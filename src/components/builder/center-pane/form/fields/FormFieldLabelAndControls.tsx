import { toast } from 'sonner';
import React, { LegacyRef } from 'react';
import { CopyIcon, Grip, Settings } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';

import FormLabel from './FormLabel';
import CustomTooltip from '@/components/ui/custom-tooltip';

import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';

interface FormFieldLabelAndControlsProps {
  field: FormFieldProps['field'];
  listeners?: ReturnType<typeof useSortable>['listeners'];
  attributes?: ReturnType<typeof useSortable>['attributes'];
  setActivatorNodeRef?: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  isDragging?: boolean;
}

const FormFieldLabelAndControls = ({
  field,
  listeners,
  attributes,
  setActivatorNodeRef,
  isDragging,
}: FormFieldLabelAndControlsProps) => {
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);
  const duplicateField = useFormActionProperty('duplicateField');
  const { setSection, FORMSECTIONS } = useFormSectionDisplay();

  const handleFieldSettingsClick = () => {
    setSelectedField(field);
    setSection(FORMSECTIONS.Settings);
  };

  const handleFieldDuplicateClick = () => {
    duplicateField(field?.id);
    toast('Field duplicated successfully', {
      description: 'Go to Settings to configure the field.',
    });
  };

  const renderIcon = (Icon: React.ElementType, onClick: () => void, tooltip: string) => {
    return (
      <CustomTooltip tooltip={tooltip}>
        <Icon
          onClick={onClick}
          className="w-4 h-4 text-[#b6a2a2] cursor-pointer opacity-100 md:opacity-20 group-hover:opacity-100 hover:scale-125"
        />
      </CustomTooltip>
    );
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
        {renderIcon(CopyIcon, handleFieldDuplicateClick, 'Duplicate field')}
        {renderIcon(Settings, handleFieldSettingsClick, 'Field settings')}
        <CustomTooltip tooltip={isDragging ? '' : 'Drag to reorder'}>
          <Grip
            className={cn(
              'w-4 min-w-4 h-4 min-h-4 text-[#b6a2a2] cursor-grab focus:outline-none opacity-100 md:opacity-20 group-hover:opacity-100 hover:scale-125',
            )}
            {...(listeners as SyntheticListenerMap)}
            {...attributes}
            ref={setActivatorNodeRef as LegacyRef<SVGSVGElement>}
          />
        </CustomTooltip>
      </div>
    </div>
  );
};

export default FormFieldLabelAndControls;
