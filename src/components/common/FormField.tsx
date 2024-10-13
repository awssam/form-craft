import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { GenericProps } from "@/types/common";

interface FormFieldProps extends GenericProps {
  label: string;
  id: string;
}

const FormField = ({ label, id, children, className }: FormFieldProps) => {
  const classes = cn("flex flex-col gap-1", className);
  return (
    <Label className={classes} htmlFor={id}>
      <span className="font-semibold text-muted-foreground text-sm">
        {label}
      </span>
      {children}
    </Label>
  );
};

export default FormField;
