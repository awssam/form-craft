'use client';

import React, { useRef } from 'react';
import { useFormProperty, useUIEventsProperty } from '@/zustand/store';
import DroppableFormPage from './form/DroppableFormPage';
import NewPagePlaceholder from './form/NewPagePlaceholder';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import { FieldEntity } from '@/types/form-config';
import FormContent from './form/FormContent';

interface CenterPaneProps extends GenericProps {
  activeField: FieldEntity | null;
}

const CenterPane = ({ className, activeField }: CenterPaneProps) => {
  const isDraggingFormField = useUIEventsProperty('isDraggingFormField');
  const pages = useFormProperty('pages');

  const paneRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const classes = cn('h-full overflow-auto bg-background flex flex-col items-center py-12 px-4 center-pane', className);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDraggingFormField) return (isDragging.current = false);

    const pane = paneRef.current;
    if (pane) {
      isDragging.current = true;
      startY.current = e.pageY - pane.offsetTop; // Capture the starting Y position
      scrollTop.current = pane.scrollTop; // Capture current scrollTop position
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || isDraggingFormField) return;

    const pane = paneRef.current;
    if (pane) {
      const y = e.pageY - pane.offsetTop; // Get the new Y position
      const walk = (y - startY.current) * 1.2; // Multiply by 2 for faster scrolling
      pane.scrollTop = scrollTop.current - walk; // Update scrollTop
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  return (
    <div
      className={classes}
      ref={paneRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex flex-col items-center gap-12 w-full min-h-[200dvh] h-max transition-all ease-in-out duration-200"
        id="form-canvas"
      >
        {pages?.map((pageId, index) => (
          <DroppableFormPage
            id={pageId}
            key={pageId}
            pageNumber={index + 1}
            totalPages={pages?.length}
            className="relative items-start !cursor-auto"
          >
            <FormContent activeField={activeField} pageId={pageId} isLastPage={index === pages.length - 1} />
          </DroppableFormPage>
        ))}
        <NewPagePlaceholder />
      </div>
    </div>
  );
};

export default CenterPane;
