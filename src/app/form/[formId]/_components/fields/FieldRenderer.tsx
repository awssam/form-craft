import { GenericProps } from '@/types/common';
import { FieldEntity, FieldType, FormConfig } from '@/types/form-config';
import FormTextField from './Text';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import FormTextareaField from './Textarea';
import FormDropdownField from './Dropdown';
import FormRadioField from './Radio';
import FormCheckboxField from './Checkbox';
import FormDatePickerField from './Datepicker';
import FileUploadField from './FileUpload';

interface FieldRendererProps {
  field: FieldEntity;
  formConfig: FormConfig;
  control: UseFormReturn['control'];
  formValuesByPageMap?: { [key: string]: FieldValues };
  pageId: string;
  actionDisabler?: React.Dispatch<React.SetStateAction<boolean>>;
}

export type FieldProps = FieldRendererProps & GenericProps;

const COMPONENT_MAP: { [key in FieldType]?: React.FC<FieldProps> } = {
  text: FormTextField,
  textarea: FormTextareaField,
  dropdown: FormDropdownField,
  radio: FormRadioField,
  checkbox: FormCheckboxField,
  date: FormDatePickerField,
  file: FileUploadField,
};

const FieldRenderer = (props: FieldRendererProps) => {
  const Component = COMPONENT_MAP[props?.field?.type];

  if (!Component) return null;

  return <Component {...props} />;
};

export default FieldRenderer;
