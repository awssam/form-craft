"use client";

import React from "react";

import LeftPane from "./left-pane/LeftPane";
import RightPane from "./right-pane/RightPane";
import CenterPane from "./center-pane/CenterPane";
import MobileSectionDisplayer from "../common/MobileSectionDisplayer";

import { cn } from "@/lib/utils";
import useFormSectionDisplay from "@/hooks/useFormSectionDisplay";

const SectionDisplay = () => {
  const { section, setSection, FORMSECTIONS } = useFormSectionDisplay();

  const leftPaneClasses = cn(
    "border-r-greyBorder md:border-r md:basis-1/5 min-w-[300px]",
    {
      "hidden md:flex": section !== FORMSECTIONS.Customize,
    }
  );

  const centerPaneClasses = cn("md:flex-1", {
    "hidden md:flex": section !== FORMSECTIONS.Builder,
  });

  const rightPaneClasses = cn("border-l-greyBorder md:border-l md:basis-1/5", {
    "hidden md:flex": section !== FORMSECTIONS.Settings,
  });

  return (
    <>
      <LeftPane className={leftPaneClasses} />
      <CenterPane className={centerPaneClasses} />
      <RightPane className={rightPaneClasses} />
      <MobileSectionDisplayer
        options={Object.values(FORMSECTIONS)}
        selectedOption={section}
        setSelectedOption={setSection}
      />
    </>
  );
};

export default SectionDisplay;
