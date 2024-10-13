import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";
import React from "react";

const CenterPane = ({ className }: GenericProps) => {
  const classes = cn("h-full bg-background flex flex-col items-center p-4", className);

  return (
    <div className={classes}>
      {/* Left Pane */}
      <h3 className="font-bold text-white text-xl"> Center pane </h3>{" "}
    </div>
  );
};

export default CenterPane;
