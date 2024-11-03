import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { GenericProps } from "@/types/common";

interface FormFieldProps extends GenericProps {
  label: string;
  id: string;
  required?: boolean;
}

const FormField = ({
  label,
  id,
  children,
  className,
  required,
}: FormFieldProps) => {
  const classes = cn("flex flex-col gap-1", className);
  return (
    <Label className={classes} htmlFor={id}>
      <span className="font-semibold text-muted-foreground text-sm">
        {label}
        {required && (
          <sup className="top-[-0.1em] ml-[1px] font-bold text-red-500 text-sm">*</sup>
        )}
      </span>
      {children}
    </Label>
  );
};

export default FormField;
