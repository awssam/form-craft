import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";
import { useFormConfigStore,  } from "@/zustand/store";
import { File } from "lucide-react";
import React from "react";

interface FormPageProps extends GenericProps {
  pageNumber: number;
}

const FormPage = ({ className, children, pageNumber }: FormPageProps) => {
  const bgColor = useFormConfigStore(
    (state) => state?.formConfig?.theme?.properties?.formBackgroundColor
  );
  const classes = cn(
    "flex flex-col gap-3 border-yellow-200/10 px-3 py-5 md:px-5 md:py-5  border border-dashed rounded-md min-h-64   transition-all duration-300",

    className
  );
  return (
    <section className="flex flex-col gap-6 w-[95%] md:w-[min(80%,800px)]">
      <h3 className="flex items-center gap-2 font-bold text-[14px] text-muted-foreground">
       <File className="w-4 h-4" /> Page {pageNumber}{" "}
      </h3>
      <div className={classes} style={{ backgroundColor: bgColor }}>
        {children}
      </div>
    </section>
  );
};

export default FormPage;
