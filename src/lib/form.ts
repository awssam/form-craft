import { FieldEntity, FieldType, FormConfig } from '@/types/form-config';
import { generateId } from './utils';
import { formThemes } from '@/zustand/data';
import { format } from '@/lib/datetime';

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
      baseField.helperText = '';
    case 'dropdown':
      baseField.options = [
        { label: 'Option 1', value: 'option-1', helperText: '' },
        { label: 'Option 2', value: 'option-2', helperText: '' },
      ];
      if (type === 'dropdown') {
        baseField.placeholder = 'Select an option...';
      }

      break;

    case 'date':
      baseField.placeholder = 'Select a date...';
      baseField.defaultValue = undefined;

    default:
      baseField.helperText = `This is a ${type} field`;
      break;
  }

  return baseField;
};

export const createNewPageEntity = () => {
  const pageId = generateId();
  return {
    id: pageId,
    name: `Page`,
    fields: [],
  };
};

export const convertFieldType = (field: FieldEntity, newFieldType: FieldType): FieldEntity => {
  const newField: FieldEntity = {
    ...field,
    type: newFieldType,
  };

  switch (newFieldType) {
    case 'checkbox':
    case 'radio':
      newField.helperText = '';
      newField.options = field?.options ?? [{ label: 'Option 1', value: 'option-1', helperText: '' }];
      newField.value = undefined;
      newField.defaultValue = undefined;
      break;

    case 'dropdown':
      newField.options = field?.options ?? [{ label: 'Option 1', value: 'option-1', helperText: '' }];
      newField.value = undefined;
      newField.placeholder = 'Select an option...';
      newField.defaultValue = undefined;
      break;
    case 'date':
      newField.placeholder = 'Select a date...';
      delete newField['defaultValue'];
      delete newField['value'];
      break;
    default:
      break;
  }

  return newField;
};

export const Field_Type_Options = [
  'text',
  'date',
  'radio',
  'checkbox',
  'dropdown',
  // "file",
  'textarea',
]?.map((type) => ({
  label: type?.replace(type?.charAt(0), type?.charAt(0)?.toUpperCase()),
  value: type,
}));

export const createNewForm = (userId: string | null): FormConfig | null => {
  const defaultField = createNewFormField({
    type: 'text',
    name: generateId(),
    label: 'Text field',
  });

  const defaultPage = createNewPageEntity();
  const defaultPageId = defaultPage.id;

  return {
    id: generateId(),
    name: 'Form - ' + format(new Date(), 'dd-MM-yyyy hh:mm'),
    createdBy: userId!,
    description: 'Your form description goes here',
    image: '',
    status: 'draft',
    tags: [],
    multiPage: false,
    pages: [defaultPageId],
    pageEntities: {
      [defaultPageId]: {
        ...defaultPage,
        fields: [defaultField.id],
        name: 'Page 1',
      },
    },
    fieldEntities: {
      [defaultField.id as string]: defaultField,
    },
    settings: {
      submission: {
        emailNotifications: true,
        redirectURL: '/thank-you',
      },
      fileUploadLimit: '10MB',
    },
    styles: {},
    theme: {
      type: 'charcoal-black',
      id: 'charcoal-black',
      properties: formThemes['charcoal-black'],
    },
  };
};

export const saveFormConfigToLocalStorage = (formConfig: FormConfig) => {
  localStorage.setItem('formConfig', JSON.stringify(formConfig));
};

export const loadFormConfigFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  const formConfig = localStorage.getItem('formConfig');
  return formConfig ? JSON.parse(formConfig) : null;
};
