'use client';

import React from 'react';

import LeftPane from './left-pane/LeftPane';
import RightPane from './right-pane/RightPane';
import CenterPane from './center-pane/CenterPane';
import MobileSectionDisplayer from '@/components/common/MobileSectionDisplayer';

import { cn } from '@/lib/utils';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { FieldEntity } from '@/types/form-config';
import { useFormActionProperty, useFormProperty, useUIEventsActionProperty } from '@/zustand/store';
import { arrayMove } from '@dnd-kit/sortable';

const SectionDisplay = () => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor));
  const [activeField, setActiveField] = React.useState<FieldEntity | null>(null);

  const { section, setSection, FORMSECTIONS } = useFormSectionDisplay();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const leftPaneClasses = cn('border-r-greyBorder md:border-r md:basis-1/5 min-w-[300px]', {
    'hidden md:flex': section !== FORMSECTIONS.Customize,
  });

  const centerPaneClasses = cn('md:flex-1', {
    'hidden md:flex': section !== FORMSECTIONS.Builder,
  });

  const rightPaneClasses = cn('border-l-greyBorder md:border-l md:basis-1/5', {
    'hidden md:flex': section !== FORMSECTIONS.Settings,
  });

  const fieldEntities = useFormProperty('fieldEntities');
  const pageEntities = useFormProperty('pageEntities');

  const setIsDraggingFormField = useUIEventsActionProperty('setIsDraggingFormField');
  const setPageFields = useFormActionProperty('setPageFields');

  const leftpane = <LeftPane className={leftPaneClasses} />;
  const rightpane = <RightPane className={rightPaneClasses} />;
  const centerpane = <CenterPane className={centerPaneClasses} activeField={activeField} />;

  const handleDragStart = (event: DragStartEvent) => {
    setIsDraggingFormField(true);
    setActiveField(fieldEntities?.[event.active?.id as string] as FieldEntity);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setIsDraggingFormField(false);

    const sourcePageId = active?.data?.current?.sortable?.containerId;
    const targetPageId = over?.data?.current?.sortable?.containerId ?? over?.id;

    const sourcePageFields = pageEntities?.[sourcePageId as string]?.fields || [];
    const targetPageFields = pageEntities?.[targetPageId as string]?.fields || [];

    const sourceIdx = active?.data?.current?.sortable?.index;
    const targetIdx = over?.data?.current?.sortable?.index;

    // if source and target page is different and target page has no fields
    if (sourcePageId !== targetPageId && targetPageFields?.length === 0) {
      const newSourceFields = sourcePageFields.filter((fieldId: string) => fieldId !== active?.id);
      setPageFields(sourcePageId, newSourceFields);
      const newTargetFields = [active?.id as string];
      setPageFields(targetPageId, newTargetFields);
    }

    // if source and target page is same
    if (sourcePageId === targetPageId) {
      const newFields = arrayMove(sourcePageFields, sourceIdx, targetIdx);
      setPageFields(sourcePageId, newFields);
    }

    // if source and target page is different
    if (sourcePageId !== targetPageId && targetPageFields?.length > 0) {
      const newSourceFields = sourcePageFields.filter((fieldId: string) => fieldId !== active.id);
      const newTargetFields = targetPageFields?.toSpliced(targetIdx, 0, active?.id as string);

      setPageFields(sourcePageId, newSourceFields);
      setPageFields(targetPageId, newTargetFields);
    }

    setActiveField(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const isOverPage = event.over?.data?.current?.type === 'form_page';

    const activeContainerId = event.active?.data?.current?.sortable?.containerId;
    const overContainerId = event.over?.data?.current?.sortable?.containerId || (isOverPage ? event?.over?.id : null);

    if (activeContainerId === overContainerId) return;

    const activeContainerFields = pageEntities?.[activeContainerId as string]?.fields || [];
    const overContainerFields = pageEntities?.[overContainerId as string]?.fields || [];

    const overIdx = event.over?.data?.current?.sortable?.index;

    if (activeContainerId !== overContainerId && !isOverPage) {
      const newActiveFields = activeContainerFields.filter((fieldId: string) => fieldId !== event.active?.id);
      const newOverFields = overContainerFields?.toSpliced(overIdx, 0, event.active?.id as string);

      setPageFields(activeContainerId, newActiveFields);
      setPageFields(overContainerId, newOverFields);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      id="form-preview"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      // onDragMove={handleDragMove}
    >
      {isLargeScreen && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={23} minSize={20} maxSize={28}>
            {leftpane}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={40} maxSize={80}>
            {centerpane}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={23} minSize={20} maxSize={28}>
            {rightpane}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {!isLargeScreen && (
        <>
          {leftpane}
          {centerpane}
          {rightpane}
        </>
      )}

      <MobileSectionDisplayer
        options={Object.values(FORMSECTIONS)}
        selectedOption={section}
        setSelectedOption={setSection}
      />
    </DndContext>
  );
};

export default SectionDisplay;
