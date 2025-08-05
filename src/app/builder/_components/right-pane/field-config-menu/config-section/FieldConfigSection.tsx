import React from 'react';

import {
  FieldName,
  FieldLabel,
  // FieldType,
  FieldPlaceholder,
  FieldHelperText,
  FieldDefaultValue,
  FieldOptionsForm,
  FieldWidth,
  FieldAllowMultiSelect,
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
      case 'dropdown':
        return (
          <>
            <FieldHelperText />
            <FieldAllowMultiSelect />
            <FieldOptionsForm />
          </>
        );
      case 'file':
        return (
          <>
            <FieldHelperText />
            <FieldAllowMultiSelect />
          </>
        );
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return <FieldHelperText />;
      case 'textarea':
        return <FieldHelperText />;
      case 'date':
      case 'datetime':
        return <FieldHelperText />;
      default:
        return <FieldHelperText />;
    }
  };

  return (
    <FormConfigSection
      icon={<Tag className="w-4 h-4 text-white/90" />}
      title="Field Configuration"
      subtitle="Basic details about the form field"
      key={selectedField?.id}
    >
      <FieldName />
      {/* <FieldType /> */}
      <FieldWidth />
      <FieldLabel />
      <FieldPlaceholder />
      {selectedField?.type !== 'file' && <FieldDefaultValue />}
      {renderFieldSpecificConfig()}
    </FormConfigSection>
  );
};

export default FieldConfigSection;
