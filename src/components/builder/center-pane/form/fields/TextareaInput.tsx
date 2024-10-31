import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "@/types/common";
import React from "react";
import withResponsiveWidthClasses from "./withResponsiveWidthClasses";
import FormLabel from "./FormLabel";
import { useFormConfigStore } from "@/zustand/store";

const TextareaInput = ({ field, className }: FormFieldProps) => {
  const theme = useFormConfigStore((s) => s.formConfig.theme?.type);
  const primaryColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.primaryTextColor
  );
  const inputBorderColor = useFormConfigStore(
    (s) => s.formConfig.theme?.properties?.inputBorderColor
  );
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FormLabel htmlFor={field?.id}>{field?.label}</FormLabel>
      <Textarea
        placeholder={field?.placeholder}
        id={field?.id}
        style={{ color: primaryColor, borderColor: inputBorderColor }}
        className={cn({
          "placeholder:text-[#7F7F7F]": theme === "midnight-black",
          "placeholder:text-[#A1A1A1]": theme === "deep-space",
          "placeholder:text-[#8C8C8C]": theme === "charcoal-black",
          "placeholder:text-[#A77BCA]": theme === "deep-violet",
          "placeholder:text-[#BDC3C7]": theme === "night-sky",
        })}
      />
    </div>
  );
};

export default withResponsiveWidthClasses(TextareaInput);
