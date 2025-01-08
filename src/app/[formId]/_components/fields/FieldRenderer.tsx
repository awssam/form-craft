import { GenericProps } from '@/types/common';
import { FieldEntity, FieldType, FormConfig } from '@/types/form-config';
import FormTextField from './Text';
import { UseFormReturn } from 'react-hook-form';
import FormTextareaField from './Textarea';
import FormDropdownField from './Dropdown';

interface FieldRendererProps {
  field: FieldEntity;
  formConfig: FormConfig;
  control: UseFormReturn['control'];
}

export type FieldProps = FieldRendererProps & GenericProps;

const COMPONENT_MAP: { [key in FieldType]?: React.FC<FieldProps> } = {
  text: FormTextField,
  textarea: FormTextareaField,
  dropdown: FormDropdownField,
};

const FieldRenderer = (props: FieldRendererProps) => {
  const Component = COMPONENT_MAP[props?.field?.type];

  if (!Component) return null;

  return <Component {...props} />;
};

export default FieldRenderer;
