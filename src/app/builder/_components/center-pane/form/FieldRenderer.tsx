import { FieldEntity } from '@/types/form-config';
import React from 'react';
import FormTextInput from './fields/TextInput';
import FormRadioInput from './fields/RadioInput';
import FormCheckboxInput from './fields/CheckboxInput';
import FormTextareaInput from './fields/TextareaInput';
import FormDateInput from './fields/DateInput';
import FormDropdown from './fields/DropdownInput';
import { Control } from 'react-hook-form';
import FileUploaderInput from './fields/FileInput';

interface FieldRendererProps {
  field: FieldEntity;
  control: Control | null;
  isOverlay?: boolean;
}

const FieldRenderer = (props: FieldRendererProps) => {
  switch (props?.field?.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'number':
      return <FormTextInput {...props} />;
    case 'textarea':
      return <FormTextareaInput {...props} />;
    case 'date':
    case 'datetime':
      return <FormDateInput {...props} />;
    case 'checkbox':
      return <FormCheckboxInput {...props} />;
    case 'radio':
      return <FormRadioInput {...props} />;
    case 'dropdown':
      return <FormDropdown {...props} />;
    case 'file':
      return <FileUploaderInput {...props} />;
    default:
      return null;
  }
};

export default FieldRenderer;
