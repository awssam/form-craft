import React from "react";
import { Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import FormField from "@/components/common/FormField";
import FormConfigSection from "@/components/common/FormConfigSection";

const options = [
  {
    value: "tag1",
    label: "Tag 1 ",
  },
  {
    value: "tag2",
    label: "Tag 2",
  },
  {
    value: "tag3",
    label: "Tag 3",
  },
  {
    value: "tag4",
    label: "Tag 4",
  },
  {
    value: "tag5",
    label: "Tag 5",
  },
];

const FormInfo = () => {
  return (
    <FormConfigSection
      icon={<Info className="w-4 h-4 text-headerPink" />}
      title="Form Information"
      subtitle="These are some basic details about your form."
    >
      <FormField label="Form Description" id="description">
        <Input id="description" className="bg-background" />
      </FormField>

      <FormField label="Tags (Only for filtering)" id="tags">
        <Combobox options={options} allowMultiple />
      </FormField>

      <FormField label="Cover Picture" id="coverPicture">
        <Input id="coverPicture" className="bg-background" type="file" />
      </FormField>

      <FormField label="Form Status" id="formStatus">
        <RadioGroup
          defaultValue="draft"
          className="flex items-center gap-4 my-1"
        >
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="draft" id="draft" />
            <Label htmlFor="draft">Draft</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="ready" id="ready" />
            <Label htmlFor="ready">Ready</Label>
          </div>
        </RadioGroup>
      </FormField>
    </FormConfigSection>
  );
};

export default FormInfo;
