import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { useFormConfigStore } from '@/zustand/store';
import { useDroppable } from '@dnd-kit/core';
import { File } from 'lucide-react';
import React from 'react';

interface FormPageProps extends GenericProps {
  pageNumber: number;
  id: string;
}

const DroppableFormPage = ({ className, children, pageNumber, id }: FormPageProps) => {
  const bgColor = useFormConfigStore((state) => state?.formConfig?.theme?.properties?.formBackgroundColor);

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
  return (
    <section className="flex flex-col gap-6 w-[95%] md:w-[min(80%,800px)]">
      <h3 className="flex items-center gap-2 font-bold text-[14px] text-muted-foreground">
        <File className="w-4 h-4" /> Page {pageNumber}{' '}
      </h3>
      <div className={classes} style={{ backgroundColor: bgColor }} ref={setNodeRef}>
        {children}
      </div>
    </section>
  );
};

export default DroppableFormPage;
