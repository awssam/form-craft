"use client";

import { Brush } from "lucide-react";
import React, { useState } from "react";

import FormConfigSection from "@/components/common/FormConfigSection";
import FormField from "@/components/common/FormField";
import ColorPicker from "@/components/ui/colorpicker";

const FormCustomization = () => {
  const [bgColor, setBgColor] = useState("#000000");
  const [fpColor, setFPColor] = useState("#ffffff");
  const [fsColor, setFSColor] = useState("#ffff12");

  return (
    <FormConfigSection
      icon={<Brush className="w-4 h-4 text-headerPink" />}
      title="Customization"
      subtitle="Make your form look like your brand."
    >
      <div className="flex flex-col gap-3 border-input bg-background px-3 py-5 border border-dashed rounded-md min-w-100">
        <FormField label="Background Color" id="primaryColor">
          <ColorPicker
            showLabel={true}
            triggerClassName="flex-row w-[max-content]"
            className="w-6 h-6"
            color={bgColor}
            onChange={setBgColor}
          />
        </FormField>

        <FormField label="Font Primary Color" id="primaryColor">
          <ColorPicker
            showLabel={true}
            triggerClassName="flex-row w-[max-content]"
            className="w-6 h-6"
            color={fpColor}
            onChange={setFPColor}
          />
        </FormField>

        <FormField label="Font Secondary Color" id="primaryColor">
          <ColorPicker
            showLabel={true}
            triggerClassName="flex-row w-[max-content]"
            className="w-6 h-6"
            color={fsColor}
            onChange={setFSColor}
          />
        </FormField>
      </div>
    </FormConfigSection>
  );
};

export default FormCustomization;
