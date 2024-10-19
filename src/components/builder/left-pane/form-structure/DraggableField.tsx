import { Grip } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LegacyRef } from "react";
import { FieldEntity } from "@/types/form-config";
import { cn } from "@/lib/utils";


type DraggableFieldProps = {
  id: string;
  label: string;
  activeField?: FieldEntity | null;
  isOverlay?: boolean;
  isDraggingOver?: boolean;
  draggedOverPosition?: "top" | "bottom";
};

const DraggableField = ({
  label,
  id,
  isOverlay,
  draggedOverPosition,
}: DraggableFieldProps) => {
  const {
    attributes,
    isDragging,
    isOver,
    isSorting,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
  } = useSortable({
    id,
    data: { type: "form_field", id },
  });

  const styles: React.CSSProperties = {
    transform: isSorting ? undefined : CSS.Translate.toString(transform),
    zIndex: isDragging ? 100 : undefined,
    opacity: isOver ? 0.6 : 1,
  };

  if (isDragging && !isOverlay) return null;

  return (
    <>
      <div
        id={isOverlay ? `overlay-${id}` : id}
        className={cn(
          "flex justify-between items-center gap-3 border-2 border-input/35 px-3 py-2 rounded-md min-h-6 transition-all duration-300",
          {
            "border-t-yellow-200": isOver && draggedOverPosition === "top",
            "border-b-yellow-200": isOver && draggedOverPosition === "bottom",

            "bg-black border-zinc-800": isOverlay,
          }
        )}
        style={styles}
        ref={setNodeRef}
      >
        <p className="font-semibold text-foreground text-sm">{label}</p>
        <Grip
          className={cn("w-4 min-w-4 h-6 min-h-6 text-foreground cursor-grab focus:outline-none",{
            "cursor-grabbing": isDragging || isOverlay})}
          ref={setActivatorNodeRef as LegacyRef<SVGSVGElement>}
          {...listeners}
          {...attributes}
        />
      </div>
    </>
  );
};

export default DraggableField;
