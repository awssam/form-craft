'use client';

import React, { Dispatch, SetStateAction } from 'react';

import dynamic from 'next/dynamic';

const LeftPane = dynamic(() => import('./left-pane/LeftPane'), {
  ssr: false,
  loading: () => <LeftPaneSkeleton />,
});

const RightPane = dynamic(() => import('./right-pane/RightPane'), {
  ssr: false,
  loading: () => <RightPaneSkeleton />,
});

const CenterPane = dynamic(() => import('./center-pane/CenterPane'), {
  ssr: false,
  loading: () => <CenterPaneSkeleton />,
});

const MobileSectionDisplayer = dynamic(() => import('@/components/common/MobileSectionDisplayer'), { ssr: false });

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
import { useAutoSaveFormConfig } from '@/data-fetching/client/form';
import { Skeleton } from '@/components/ui/skeleton';

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

  useAutoSaveFormConfig();

  return (
    <main className="flex md:flex-row flex-col flex-nowrap bg-background w-[100dvw] h-[100dvh]">
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
          setSelectedOption={setSection as Dispatch<SetStateAction<unknown>>}
        />
      </DndContext>
    </main>
  );
};

function LeftPaneSkeleton() {
  return (
    <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto">
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="p-4 space-y-10" key={index}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CenterPaneSkeleton() {
  return (
    <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto z-10">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="flex flex-col gap-4 max-w-[80%] mx-auto mb-[100px]" key={index}>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ))}
    </div>
  );
}

function RightPaneSkeleton() {
  return (
    <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto z-10">
      <Skeleton className="h-8 w-full max-w-[95%] mx-auto" />

      <div className="mt-[40px] flex flex-col gap-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex flex-col gap-[40px] mt-[40px]">
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton className="h-[70px] w-full" key={index} />
        ))}
      </div>
    </div>
  );
}
export default SectionDisplay;
