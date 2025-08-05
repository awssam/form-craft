import { toast } from 'sonner';
import React, { LegacyRef, useCallback } from 'react';
import { Grip, Settings, Copy, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useFormActionProperty, useSelectedFieldStore } from '@/zustand/store';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';

import FormLabel from './FormLabel';
import CustomTooltip from '@/components/ui/custom-tooltip';

import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types/common';
import DeleteFieldModal from '@/app/builder/_components/DeleteFieldModal';
import EditableText from '@/components/common/EditableText';

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
  const selectedField = useSelectedFieldStore((s) => s.selectedField);
  const updateFormField = useFormActionProperty('updateFormField');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleFieldSettingsClick = () => {
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

  const handleFormLabelChange = (value: string) => {
    updateFormField(field?.id, {
      id: field?.id,
      label: value,
    });
    if (selectedField?.id === field?.id) {
      setSelectedField({
        ...selectedField,
        label: value,
      });
    }
  };

  return (
    <div className="flex gap-3 items-center justify-between break-all break-words">
      <EditableText
        tooltipBtnClassName="self-center -mb-3"
        value={field?.label || ''}
        renderText={(_, onClick) => (
          <FormLabel htmlFor={field?.id} className="relative flex " onClick={onClick}>
            <span>{field.label || <span className="text-muted-foreground">{"What's this field called?"}</span>}</span>
            <span className="sr-only">{field?.helperText}</span>
            {field?.validation?.custom?.required?.value !== 'false' && !!field?.validation?.custom?.required?.value && (
              <sup className="top-[-0.1em] ml-[1px] font-bold text-red-500 text-sm">*</sup>
            )}
          </FormLabel>
        )}
        inputClassName="text-xs md:text-[12px] focus-visible:border-b-0 focus-visible:ring-0"
        onChange={handleFormLabelChange}
        inputPlaceholder="What's this field called?"
      />
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

        <CustomTooltip tooltip={'Duplicate Field'}>
          <Copy
            className={cn('md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-[#b6a2a2] focus:outline-none hover:scale-125 cursor-pointer')}
            onClick={handleFieldDuplicateClick}
          />
        </CustomTooltip>

        <CustomTooltip tooltip={'Delete Field'}>
          <Trash2
            className={cn('md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-[#b6a2a2] focus:outline-none hover:scale-125 cursor-pointer hover:text-red-500')}
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </CustomTooltip>

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
