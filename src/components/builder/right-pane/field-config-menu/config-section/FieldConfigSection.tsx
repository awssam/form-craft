import React from "react";

import {
  FieldName,
  FieldLabel,
  FieldType,
  FieldPlaceholder,
  FieldHelperText,
} from "./fields";
import { Tag } from "lucide-react";
import FormConfigSection from "@/components/common/FormConfigSection";

const FieldConfigSection = () => {
  return (
    <FormConfigSection
      icon={<Tag className="w-4 h-4 text-muted-foreground" />}
      title="Field Config"
      subtitle="Basic details about the form field"
    >
      <FieldName />
      <FieldType />
      <FieldLabel />
      <FieldPlaceholder />
      <FieldHelperText />
    </FormConfigSection>
  );
};

export default FieldConfigSection;
