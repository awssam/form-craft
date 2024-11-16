import FormConfigSection from "@/components/common/FormConfigSection";
import { CheckCircle } from "lucide-react";
import React from "react";
import {
  FieldExactLength,
  FieldStartsWith,
  FieldEndsWith,
  FieldMinLength,
  FieldMaxLength,
  FieldContains,
  FieldMatchesRegex,
  FieldNoWhitespace,
  FieldIsEmail,
  FieldIsURL,
  FieldIsNumeric,
  FieldIsAlpha,
  FieldIsAlphanumeric,
  FieldNoSpecialCharacters,
  FieldRequired,
} from "./fields";

const FieldValidationSection = () => {
  return (
    <FormConfigSection
      subtitle="Setup validations for your fields quickly"
      icon={<CheckCircle className="w-4 h-4 text-muted-foreground" />}
      title="Field validation"
    >
      <FieldRequired />
      <FieldExactLength />
      <FieldStartsWith />
      <FieldEndsWith />
      <FieldMinLength />
      <FieldMaxLength />
      <FieldContains />
      <FieldMatchesRegex />
      <FieldNoWhitespace />
      <FieldIsEmail />
      <FieldIsURL />
      <FieldIsNumeric />
      <FieldIsAlpha />
      <FieldIsAlphanumeric />
      <FieldNoSpecialCharacters />
    </FormConfigSection>
  );
};

export default FieldValidationSection;
