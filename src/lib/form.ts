import { FieldEntity, FieldType } from '@/types/form-config';
import { generateId } from './utils';

export const createNewFormField = ({
  type,
  name,
  label,
}: {
  type: FieldType;
  name: string;
  label: string;
}): FieldEntity => {
  const fieldId = generateId();

  const baseField: FieldEntity = {
    id: fieldId,
    name,
    type,
    label,
    placeholder: 'Enter something here...',
    width: '100%',
    helperText: 'Some information about this field',
  };

  switch (type) {
    case 'checkbox':
    case 'radio':
      baseField.options = [
        { label: 'Option 1', value: 'option-1', helperText: '' },
        { label: 'Option 2', value: 'option-2', helperText: '' },
      ];
      break;
    default:
      break;
  }

  return baseField;
};

export const Field_Type_Options = [
  'text',
  'date',
  'radio',
  'checkbox',
  // "dropdown",
  // "file",
  'textarea',
]?.map((type) => ({
  label: type?.replace(type?.charAt(0), type?.charAt(0)?.toUpperCase()),
  value: type,
}));
