import { toast } from 'sonner';
import React, { LegacyRef, useCallback, useMemo } from 'react';
import { Grip, Settings } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import KebabMenu from '@/components/ui/kebabmenu';

import { useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';

import FormLabel from './FormLabel';
import CustomTooltip from '@/components/ui/custom-tooltip';

import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import DeleteFieldModal from '@/components/pages/builder/DeleteFieldModal';

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
  const deleteField = useFormActionProperty('deleteField');
  const { setSection, FORMSECTIONS } = useFormSectionDisplay();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleFieldSettingsClick = () => {
    console.log('handleFieldSettingsClick', field);
    setSelectedField(field);
    setSection(FORMSECTIONS.Settings);
  };

  const handleFieldDuplicateClick = useCallback(() => {
    duplicateField(field?.id);
    toast.info('Field duplicated successfully', {
      description: 'Go to Settings to configure the field.',
    });
  }, [duplicateField, field?.id]);

  const handleFieldDelete = () => {
    deleteField(field?.id);
    toast.info('Field deleted successfully');
  };

  const menuItems = useMemo(() => {
    return [
      {
        label: 'Duplicate Field',
        onClick: handleFieldDuplicateClick,
        seperator: true,
      },
      {
        label: 'Delete Field',
        onClick: () => setIsDeleteModalOpen(true),
        className: 'text-red-500',
        seperator: false,
      },
    ];
  }, [handleFieldDuplicateClick]);

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
        <CustomTooltip tooltip={isDragging ? '' : 'Drag to reorder'}>
          <Grip
            className={cn(
              'md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-[#b6a2a2] cursor-grab focus:outline-none hover:scale-125',
            )}
            {...(listeners as SyntheticListenerMap)}
            {...attributes}
            ref={setActivatorNodeRef as LegacyRef<SVGSVGElement>}
          />
        </CustomTooltip>

        <CustomTooltip tooltip={'Field Settings'}>
          <Settings
            className={cn('md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-[#b6a2a2] focus:outline-none hover:scale-125')}
            onClick={handleFieldSettingsClick}
          />
        </CustomTooltip>

        <KebabMenu items={menuItems} />

        <DeleteFieldModal
          showTrigger={false}
          fieldLabel={field?.label}
          onConfirm={handleFieldDelete}
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
        />
      </div>
    </div>
  );
};

export default FormFieldLabelAndControls;
