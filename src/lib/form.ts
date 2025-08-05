import { FieldEntity, FieldType, FormConfig } from '@/types/form-config';
import { FormUsageType } from '@/types/form-templates';
import { FORM_TYPE_CONFIGS } from '@/config/form-types';
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

    case 'file':
      baseField.placeholder = 'Click to upload or drag and drop';
      baseField.defaultValue = undefined;
      baseField.value = undefined;
      baseField.allowMultiSelect = false;
      baseField.helperText = 'Use this area to hint users about any rules';

      break;

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
      
    case 'datetime':
      newField.placeholder = 'Select date and time...';
      delete newField['defaultValue'];
      delete newField['value'];
      break;
      
    case 'email':
      newField.placeholder = 'Enter email address...';
      newField.defaultValue = '';
      break;
      
    case 'phone':
      newField.placeholder = 'Enter phone number...';
      newField.defaultValue = '';
      break;
      
    case 'number':
      newField.placeholder = 'Enter a number...';
      newField.defaultValue = '';
      delete newField['options'];
      break;
      
    case 'file':
      newField.placeholder = 'Click to upload or drag and drop';
      newField.allowMultiSelect = false;
      newField.helperText = 'Use this area to hint users about any rules';

      delete newField['defaultValue'];
      delete newField['value'];
      break;

    default:
      // For text and textarea, keep basic defaults
      break;
  }

  return newField;
};

export const Field_Type_Options = [
  'text', 
  'email', 
  'phone', 
  'number', 
  'date', 
  'datetime', 
  'textarea', 
  'radio', 
  'checkbox', 
  'dropdown', 
  'file'
]?.map(
  (type) => ({
    label: type?.replace(type?.charAt(0), type?.charAt(0)?.toUpperCase()),
    value: type,
  }),
);

export const createNewForm = (
  userId: string | null, 
  formType?: FormUsageType
): FormConfig | null => {
  const defaultField = createNewFormField({
    type: 'text',
    name: generateId(),
    label: 'Text field',
  });

  const defaultPage = createNewPageEntity();
  const defaultPageId = defaultPage.id;

  // Get form type configuration and field mappings
  const formTypeConfig = formType ? FORM_TYPE_CONFIGS[formType] : null;
  const fieldMappings = formTypeConfig?.fieldMappings || {};
  
  // Determine primary table based on form type
  const getPrimaryTable = (type?: FormUsageType): string => {
    const tableMap: Record<FormUsageType, string> = {
      'event-registration': 'event_registrations',
      'exhibitor-registration': 'exhibitor_registrations',
      'general': 'general_forms', // Default table for general forms
    };
    return type ? tableMap[type] || 'event_registrations' : 'event_registrations';
  };

  return {
    id: generateId(),
    name: formTypeConfig ? `${formTypeConfig.name} - ${format(new Date(), 'dd-MM-yyyy')}` : `Form - ${format(new Date(), 'dd-MM-yyyy hh:mm')}`,
    createdBy: userId!,
    description: formTypeConfig?.description || 'Your form description goes here',
    image: '',
    status: 'draft',
    tags: formType ? [formType.replace('-', ' ')] : [],
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
    // Enhanced form configuration
    formType: formType || 'event-registration',
    fieldMappings: fieldMappings,
    dbConfig: {
      primaryTable: getPrimaryTable(formType),
      enableAutoMapping: !!formType
    }
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

export const ACCEPTED_FILE_TYPES_MAP = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc', '.docx'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'audio/*': ['.mp3', '.wav', '.ogg'],
  'video/*': ['.mp4', '.avi', '.mov'],
};

export const READABLE_FILE_TYPE_MAP = {
  'image/*': 'Image',
  'application/pdf': 'PDF',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Docx',
  'audio/*': 'Audio',
  'video/*': 'Video',
};

export const REVERSE__FILE_MAP = Object.keys(ACCEPTED_FILE_TYPES_MAP)?.reduce((acc, key) => {
  const value = READABLE_FILE_TYPE_MAP[key as keyof typeof READABLE_FILE_TYPE_MAP];
  acc[value as string] = key;
  return acc;
}, {} as Record<string, string>);

export const ACCEPTED_FILE_TYPES_OPTIONS = Object.entries(ACCEPTED_FILE_TYPES_MAP).map(([key, value]) => ({
  label: READABLE_FILE_TYPE_MAP[key as keyof typeof READABLE_FILE_TYPE_MAP],
  value: value?.join(', '),
}));
