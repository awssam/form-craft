'use client';

import React from 'react';

import LeftPane from './left-pane/LeftPane';
import RightPane from './right-pane/RightPane';
import CenterPane from './center-pane/CenterPane';
import MobileSectionDisplayer from '../common/MobileSectionDisplayer';

import { cn } from '@/lib/utils';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import useMediaQuery from '@/hooks/useMediaQuery';

const SectionDisplay = () => {
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

  // TODO: Add drag and drop related logic here

  return (
    <>
      {isLargeScreen && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={20} maxSize={28}>
            <LeftPane className={leftPaneClasses} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={40} maxSize={80}>
            <CenterPane className={centerPaneClasses} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={20} maxSize={28}>
            <RightPane className={rightPaneClasses} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {!isLargeScreen && (
        <>
          <LeftPane className={leftPaneClasses} />
          <CenterPane className={centerPaneClasses} />
          <RightPane className={rightPaneClasses} />
        </>
      )}

      <MobileSectionDisplayer
        options={Object.values(FORMSECTIONS)}
        selectedOption={section}
        setSelectedOption={setSection}
      />
    </>
  );
};

export default SectionDisplay;
