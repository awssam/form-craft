import React from "react";
import { Grip, List } from "lucide-react";

import FormConfigSection from "@/components/common/FormConfigSection";
import { Button } from "@/components/ui/button";

const DUMMY_FIELDS = [
  "First Name",
  "Last Name",
  "Email",
  "Password",
  "Confirm Password",
  "Date of Birth",
];

const DUMMY_FIELDS2 = [
  "Phone Number",
  "Address",
  "City",
  "Zip Code",
  "State",
  "Country",
];

type DraggableFieldProps = {
  label: string;
};

const DraggableField = ({ label }: DraggableFieldProps) => {
  return (
    <div className="flex items-center gap-3 border-input px-3 py-2 border rounded-md min-h-6">
      <Grip className="w-4 h-6 text-foreground cursor-grab" />
      <p className="font-semibold text-foreground text-sm">{label}</p>
    </div>
  );
};

const CenteredLineText = ({ label }: { label: string }) => {
  return (
    <div className="relative flex items-center bg-input my-4 h-[1px]">
      <p className="top-1/2 left-1/2 z-10 absolute bg-background px-2 py-0.5 rounded-md font-bold text-[11px] text-muted-foreground tracking-tighter -translate-x-1/2 -translate-y-1/2">
        {label}
      </p>
    </div>
  );
};

const FormStructure = () => {
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
          <CenteredLineText label="Page 1" />
          {DUMMY_FIELDS.map((field, index) => (
            <DraggableField key={index} label={field} />
          ))}
          <CenteredLineText label="Page 2" />
          {DUMMY_FIELDS2.map((field, index) => (
            <DraggableField key={index} label={field} />
          ))}
        </section>
        <Button className="bg-zinc-900 hover:bg-zinc-800 mt-3 w-full text-foreground transition-colors">
          Add Page
        </Button>
      </div>
    </FormConfigSection>
  );
};

export default FormStructure;
