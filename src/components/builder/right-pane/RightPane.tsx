import React from "react";
import FieldConfigMenu from "./field-config-menu/FieldConfigMenu";

import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";

const RightPane = ({ className }: GenericProps) => {
  const classes = cn(
    "h-full bg-background p-4 flex flex-col gap-6 overflow-auto",
    className
  );

  return (
    <div className={classes}>
      {/* Right Pane */}

      <FieldConfigMenu />
    </div>
  );
};

export default RightPane;
