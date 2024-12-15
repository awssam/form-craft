import { cn } from '@/lib/utils';
import { useFormProperty, useUIEventsProperty } from '@/zustand/store';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';

interface ChildrenProps {
  style: React.CSSProperties;
  listeners: ReturnType<typeof useSortable>['listeners'];
  attributes: ReturnType<typeof useSortable>['attributes'];
  setActivatorNodeRef: ReturnType<typeof useSortable>['setActivatorNodeRef'];
  setNodeRef: ReturnType<typeof useSortable>['setNodeRef'];
  className?: string;
}

interface Props {
  id: string;
  children: (props: ChildrenProps) => React.ReactNode;
  isOverlay?: boolean;
  className: string | undefined;
}

const DraggableFieldWrapper = ({ id, children, isOverlay, className }: Props) => {
  const { attributes, isDragging, isOver, listeners, setNodeRef, setActivatorNodeRef, transform, transition, active } =
    useSortable({
      id,
      data: { type: 'form_field', id },
      transition: {
        duration: 200, // milliseconds
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)', // Using ease-in-out
      },
    });

  const isDraggingFormField = useUIEventsProperty('isDraggingFormField');

  const pageEntities = useFormProperty('pageEntities');

  const fields = useMemo(
    () => pageEntities?.[active?.data?.current?.sortable?.containerId]?.fields,
    [active?.data, pageEntities],
  );

  const isFieldInPage = useMemo(() => fields?.includes(id), [fields, id]);

  const styles: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : isOver ? 1 : 2,
    opacity: isOver ? 0.2 : 1,
    transition,
    marginBlock: isDragging && !isOverlay ? '25px' : 0,
    width: isDraggingFormField && isFieldInPage ? '100%' : undefined, // converting the width to 100% when dragging
  };

  // if (isDragging && !isOverlay) return null;

  return children({
    style: styles,
    listeners,
    attributes,
    setActivatorNodeRef,
    setNodeRef,
    className: cn({
      [className as string]: !isOverlay,
      'bg-black border z-[9999999] border-dashed border-yellow-200/30 hover:bg-black py-3 px-2 rounded-lg transition-colors duration-200':
        isOverlay,

      'bg-yellow-200/50 border border-dashed border-input': isDragging && !isOverlay,
    }),
  });
};

export default DraggableFieldWrapper;
