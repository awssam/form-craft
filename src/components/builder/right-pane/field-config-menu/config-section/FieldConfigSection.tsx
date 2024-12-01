import React from 'react';

import {
  FieldName,
  FieldLabel,
  FieldType,
  FieldPlaceholder,
  FieldHelperText,
  FieldDefaultValue,
  FieldOptionsForm,
  FieldWidth,
} from './Fields';
import { Tag } from 'lucide-react';
import FormConfigSection from '@/components/common/FormConfigSection';
import { useSelectedFieldStore } from '@/zustand/store';

const FieldConfigSection = () => {
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  if (!selectedField) return null;

  const renderFieldSpecificConfig = () => {
    switch (selectedField?.type) {
      case 'radio':
      case 'checkbox':
        return <FieldOptionsForm />;
      default:
        return null;
    }
  };

  return (
    <FormConfigSection
      icon={<Tag className="w-4 h-4 text-muted-foreground" />}
      title="Field Config"
      subtitle="Basic details about the form field"
      key={selectedField?.id}
    >
      <FieldName />
      <FieldType />
      <FieldLabel />
      <FieldDefaultValue />
      <FieldPlaceholder />
      <FieldHelperText />
      <FieldWidth />
      {renderFieldSpecificConfig()}
    </FormConfigSection>
  );
};

export default FieldConfigSection;
