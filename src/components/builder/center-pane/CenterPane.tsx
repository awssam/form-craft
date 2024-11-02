"use client";
import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";
import React, { useRef } from "react";
import { useFormProperty, useUIEventsProperty } from "@/zustand/store";
import FormPage from "./form/FormPage";
import FormFieldContainer from "./form/FormFieldContainer";
import FormHeaderContent from "./form/FormHeader";
import { DatePickerForm } from "./DummyForm";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const CenterPane = ({ className }: GenericProps) => {
  const isDraggingFormField = useUIEventsProperty("isDraggingFormField");
  const pages = useFormProperty("pages");

  const paneRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const classes = cn(
    "h-full overflow-auto bg-background flex flex-col items-center py-12 px-4 center-pane",
    className
  );

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
      const walk = (y - startY.current) * 2; // Multiply by 2 for faster scrolling
      pane.scrollTop = scrollTop.current - walk; // Update scrollTop
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const form = useForm({
    mode: "onChange",
  });

  return (
    <div
      className={classes}
      ref={paneRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col items-center gap-12 w-full min-h-[200dvh]">
        {pages?.map((pageId, index) => (
          <FormPage
            key={pageId}
            pageNumber={index + 1}
            className="items-start !cursor-auto"
          >
            <FormHeaderContent />
            <FormFieldContainer pageId={pageId} isLastPage={index === pages.length - 1} />
          </FormPage>
        ))}
      </div>
    </div>
  );
};

export default CenterPane;
