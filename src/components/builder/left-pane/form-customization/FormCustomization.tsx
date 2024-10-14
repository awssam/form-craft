"use client";

import { Brush } from "lucide-react";
import FormConfigSection from "@/components/common/FormConfigSection";

import {
  FormFontPrimaryColor,
  FormBackgroundColor,
  FormFontSecondaryColor,
} from "./fields";

const FormCustomization = () => {
  return (
    <FormConfigSection
      icon={<Brush className="w-4 h-4 text-headerPink" />}
      title="Customization"
      subtitle="Make your form look like your brand."
    >
      <div className="flex flex-col gap-3 border-input bg-background px-3 py-5 border border-dashed rounded-md min-w-100">
        <FormBackgroundColor />
        <FormFontPrimaryColor />
        <FormFontSecondaryColor />
      </div>
    </FormConfigSection>
  );
};

export default FormCustomization;
