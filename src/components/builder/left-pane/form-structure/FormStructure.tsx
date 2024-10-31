import React, { useState } from "react";
import { List } from "lucide-react";

import FormConfigSection from "@/components/common/FormConfigSection";
import { Button } from "@/components/ui/button";
import DraggableField from "./DraggableField";
import PageDivider from "./PageDivider";

import {
  useFormActionProperty,
  useFormProperty,
  useUIEventsActionProperty,
} from "@/zustand/store";
import DroppablePageArea from "./DroppablePageArea";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FieldEntity } from "@/types/form-config";

const FormStructure = () => {
  const pages = useFormProperty("pages");
  const pageEntities = useFormProperty("pageEntities");
  const fieldEntities = useFormProperty("fieldEntities");
  const setPageFields = useFormActionProperty("setPageFields");
  const [activeField, setActiveField] = React.useState<FieldEntity | null>(
    null
  );

  const setIsDraggingFormField = useUIEventsActionProperty(
    "setIsDraggingFormField"
  );

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const [draggedOverField, setDraggedOverField] = useState<{
    id: string;
    position: "top" | "bottom";
  } | null>(null);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setIsDraggingFormField(false);

    if (
      active.id === over?.id ||
      !active?.data?.current ||
      !over?.data?.current
    )
      return setDraggedOverField(null);

    const sourcePageId = active?.data?.current?.sortable?.containerId;
    const targetPageId = over?.data?.current?.sortable?.containerId ?? over?.id;

    const isSamePage = sourcePageId === targetPageId;

    const sourcePageFields =
      pageEntities?.[sourcePageId as string]?.fields || [];
    const targetPageFields =
      pageEntities?.[targetPageId as string]?.fields || [];

    const sourceIdx = active?.data?.current?.sortable?.index;
    let targetIdx = over?.data?.current?.sortable?.index;

    if (draggedOverField?.position === "top") {
      if (targetIdx === 0) targetIdx = 0;

      if (targetIdx > 0 && targetIdx > sourceIdx && isSamePage) targetIdx--;

      if (!targetIdx || isNaN(targetIdx)) {
        targetIdx = 0;
      }
    } else if (draggedOverField?.position === "bottom") {
      // If dragged over bottom half
      if ((targetIdx < sourceIdx && isSamePage) || !isSamePage) targetIdx++;

      if (!targetIdx || isNaN(targetIdx)) {
        targetIdx = targetPageFields?.length;
      }
    }

    // if source and target page is different and target page has no fields
    if (sourcePageId !== targetPageId && targetPageFields?.length === 0) {
      const newSourceFields = sourcePageFields.filter(
        (fieldId: string) => fieldId !== active?.id
      );
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
      const newSourceFields = sourcePageFields.filter(
        (fieldId: string) => fieldId !== active.id
      );
      const newTargetFields = targetPageFields?.toSpliced(
        targetIdx,
        0,
        active?.id as string
      );

      setPageFields(sourcePageId, newSourceFields);
      setPageFields(targetPageId, newTargetFields);
    }

    setDraggedOverField(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDraggingFormField(true);
    setActiveField(fieldEntities?.[event.active?.id as string] as FieldEntity);
  };

  const handleDragMove = ({ active, over }: DragMoveEvent) => {
    if (over) {
      if (active?.id === over?.id) return setDraggedOverField(null);

      if (
        !over?.data?.current?.type ||
        over?.data?.current?.type !== "form_field"
      )
        return;

      const fieldId = over?.id as string;
      const droppable = document.getElementById(fieldId)!;
      const dragOverlay = document.getElementById(`overlay-${active?.id}`)!;
      const dragOverlayRect = dragOverlay?.getBoundingClientRect();
      const droppableRect = droppable?.getBoundingClientRect();

      // Check for top position
      if (dragOverlayRect.top < droppableRect.top + droppableRect.height / 2) {
        setDraggedOverField({ id: fieldId, position: "top" });
      }

      // Check for bottom position
      if ( dragOverlayRect.top > droppableRect.top + (droppableRect.height / 2 - 30)) {
        setDraggedOverField({ id: fieldId, position: "bottom" });
      }
    }
  };

  return (
    <FormConfigSection
      icon={<List className="w-4 h-4 text-headerPink" />}
      title="Form Structure"
      subtitle="Quickly add, reorder and remove fields in your form."
    >
      <div className="flex flex-col gap-3 border-input bg-background px-3 py-5 border border-dashed rounded-md min-w-100 min-h-[400px]">
        <Button className="bg-zinc-900 hover:bg-zinc-800 w-full text-foreground transition-colors">
          Add Field
        </Button>

        <section className="flex flex-col gap-3">
          <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            sensors={sensors}
            collisionDetection={closestCorners}
            id="form-structure"
          >
            {pages?.map((pageId: string, idx: number) => (
              <DroppablePageArea
                pageId={pageId}
                key={pageId}
                isPageEmpty={pageEntities?.[pageId]?.fields?.length === 0}
                isOverPageItem={new Set(pageEntities?.[pageId]?.fields).has(
                  draggedOverField?.id as string
                )}
              >
                <PageDivider label={`Page ${idx + 1}`} />

                <SortableContext
                  id={pageId}
                  items={pageEntities?.[pageId]?.fields as UniqueIdentifier[]}
                  strategy={verticalListSortingStrategy}
                >
                  {pageEntities?.[pageId]?.fields?.map((fieldId) => (
                    <DraggableField
                      id={fieldId}
                      key={fieldId}
                      label={fieldEntities?.[fieldId]?.label as string}
                      activeField={activeField}
                      isDraggingOver={draggedOverField?.id === fieldId}
                      draggedOverPosition={draggedOverField?.position}
                    />
                  ))}
                </SortableContext>
              </DroppablePageArea>
            ))}
            {
              <DragOverlay>
                {activeField?.id ? (
                  <DraggableField
                    id={activeField?.id}
                    label={activeField?.label}
                    isOverlay
                  />
                ) : null}
              </DragOverlay>
            }
          </DndContext>
        </section>
        <Button className="bg-zinc-900 hover:bg-zinc-800 mt-3 w-full text-foreground transition-colors">
          Add Page
        </Button>
      </div>
    </FormConfigSection>
  );
};

export default FormStructure;
