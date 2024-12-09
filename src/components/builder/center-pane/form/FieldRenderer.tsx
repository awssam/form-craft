import { FieldEntity } from '@/types/form-config';
import React from 'react';
import FormTextInput from './fields/TextInput';
import FormRadioInput from './fields/RadioInput';
import FormCheckboxInput from './fields/CheckboxInput';
import FormTextareaInput from './fields/TextareaInput';
import FormDateInput from './fields/DateInput';
import FormDropdown from './fields/DropdownInput';
import { Control } from 'react-hook-form';

interface FieldRendererProps {
  field: FieldEntity;
  control: Control | null;
  isOverlay?: boolean;
}

const FieldRenderer = (props: FieldRendererProps) => {
  switch (props?.field?.type) {
    case 'text':
      return <FormTextInput {...props} />;
    case 'textarea':
      return <FormTextareaInput {...props} />;
    case 'date':
      return <FormDateInput {...props} />;
    case 'checkbox':
      return <FormCheckboxInput {...props} />;
    case 'radio':
      return <FormRadioInput {...props} />;
    case 'dropdown':
      return <FormDropdown {...props} />;

    default:
      return null;
  }
};

export default FieldRenderer;
