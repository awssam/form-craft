import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";
import { useDroppable } from "@dnd-kit/core";

import React from "react";

interface DroppablePageAreaProps extends GenericProps {
  pageId: string;
  isPageEmpty: boolean;
  isOverPageItem: boolean;
}

const DroppablePageArea = ({
  pageId,
  children,
  isPageEmpty,
  isOverPageItem,
}: DroppablePageAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: pageId,
    data: {
      type: "form_page",
      id: pageId,
      accepts: ["form_field"],
    },
  });
  const [label] = children as React.ReactNode[]
  return (
    <div className={
      cn("flex flex-col gap-3 border-yellow-200/10 px-2 py-5 pb-8 border border-dashed rounded-md min-h-28 transition-all duration-300", {
        "border-yellow-200/30": (isOver || isOverPageItem) && !isPageEmpty,
      })
    } ref={setNodeRef}>
      {isPageEmpty ? (
        <>
        {label}
        <div className={
          cn("flex flex-col justify-center items-center gap-3 border-input bg-background px-3 py-5 border border-dashed rounded-md min-w-100 min-h-[200px]",{
            "border-dashed": isOver,
            'border-yellow-200/30': isOver
          })
        }>
          Drop fields here
        </div>
          </>
      ) : (
        children
      )}
    </div>
  );
};

export default DroppablePageArea;
