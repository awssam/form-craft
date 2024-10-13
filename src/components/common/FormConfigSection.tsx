import { cn } from "@/lib/utils";
import { GenericProps } from "@/types/common";

interface FormSectionProps extends GenericProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const FormConfigSection = ({
  className,
  icon,
  subtitle,
  title,
  children,
}: FormSectionProps) => {
  const classes = cn("flex flex-col gap-4", className);

  return (
    <section className={classes}>
      <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-bold text-headerPink text-sm md:text-lg">
          {" "}
          {title}
        </h3>
        </div>
         {subtitle && <small className="ml-6 text-[11px] text-muted-foreground text-opacity-80">{subtitle}</small>}
      </div>

      {children}
    </section>
  );
};

export default FormConfigSection;
