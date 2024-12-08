import { Button } from '@/components/ui/button';
import Menu from '@/components/ui/kebabmenu';
import { createNewFormField } from '@/lib/form';
import { cn, generateId } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { FieldType } from '@/types/form-config';
import { useFormActionProperty, useFormConfigStore, useSelectedFieldStore } from '@/zustand/store';
import { useDroppable } from '@dnd-kit/core';
import { File } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface FormPageProps extends GenericProps {
  pageNumber: number;
  id: string;
}

const DroppableFormPage = ({ className, children, pageNumber, id }: FormPageProps) => {
  const bgColor = useFormConfigStore((state) => state?.formConfig?.theme?.properties?.formBackgroundColor);
  const addField = useFormActionProperty('addField');
  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);

  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'form_page',
      id,
      accepts: ['form_field'],
    },
  });
  const classes = cn(
    'flex flex-col gap-3 border-yellow-200/10 px-3 py-5 md:px-5 md:py-5  border border-dashed rounded-md min-h-64 transition-all duration-200',
    className,
    {
      'border-yellow-200/30': isOver,
    },
  );

  const handleAddField = () => {
    const newField = createNewFormField({
      type: 'text' as FieldType,
      name: generateId(),
      label: 'Text field',
    });

    addField(id, newField);
    setSelectedField(newField);
    toast(`New Text field added to page ${pageNumber}`, {
      description: 'Go to Settings to configure the field.',
    });
  };

  return (
    <section className="flex flex-col gap-6 w-[95%] md:w-[min(80%,800px)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 font-bold text-[14px] text-white">
          <File className="w-4 h-4" /> Page {pageNumber}{' '}
        </h3>
        <Button variant="default" size="sm" onClick={handleAddField}>
          Add Field{' '}
        </Button>
      </div>
      <div className={classes} style={{ backgroundColor: bgColor }} ref={setNodeRef}>
        {children}
      </div>
    </section>
  );
};

export default DroppableFormPage;
