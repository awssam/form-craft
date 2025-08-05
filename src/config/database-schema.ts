import { FormUsageType } from '@/types/form-templates';

// Database field types and their compatible form field types
export type DatabaseFieldType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'text' | 'json' | 'file';

export interface DatabaseField {
  name: string;
  type: DatabaseFieldType;
  required: boolean;
  maxLength?: number;
  description: string;
  validation?: string;
}

export interface DatabaseTable {
  name: string;
  displayName: string;
  description: string;
  fields: Record<string, DatabaseField>;
}

// Compatible form field types for each database field type
export const COMPATIBLE_FORM_FIELDS: Record<DatabaseFieldType, string[]> = {
  'string': ['text', 'email', 'phone', 'dropdown', 'radio'],
  'number': ['number'], 
  'boolean': ['checkbox', 'radio'],
  'date': ['date'],
  'datetime': ['datetime'],
  'text': ['textarea'],
  'json': ['checkbox', 'dropdown'], // For multi-select values
  'file': ['file']
};

// Reverse mapping: which database field types are compatible with each form field type
export const FORM_FIELD_TO_DATABASE_TYPES: Record<string, DatabaseFieldType[]> = {
  'text': ['string', 'text'],
  'email': ['string'],
  'phone': ['string'],
  'number': ['number'],
  'checkbox': ['boolean', 'json'], // Single checkbox = boolean, multiple = json array
  'radio': ['string', 'number', 'boolean'], // Can map to various types based on values
  'dropdown': ['string', 'number', 'json'], // Single select = string/number, multi-select = json
  'textarea': ['text'],
  'date': ['date'],
  'datetime': ['datetime'],
  'file': ['file']
};

// Database schema definitions for each form type - simplified to single table per form type
// Initial version with just two essential form types
export const DATABASE_SCHEMAS: Record<FormUsageType, DatabaseTable> = {
  'event-registration': {
    name: 'event_registrations',
    displayName: 'Event Registrations',
    description: 'Main registration data for event attendees',
    fields: {
      'first_name': {
        name: 'first_name',
        type: 'string',
        required: true,
        maxLength: 100,
        description: 'Attendee first name',
        validation: 'required|string|max:100'
      },
      'last_name': {
        name: 'last_name',
        type: 'string',
        required: true,
        maxLength: 100,
        description: 'Attendee last name',
        validation: 'required|string|max:100'
      },
      'email': {
        name: 'email',
        type: 'string',
        required: true,
        maxLength: 255,
        description: 'Contact email address',
        validation: 'required|email|max:255'
      },
      'phone': {
        name: 'phone',
        type: 'string',
        required: false,
        maxLength: 20,
        description: 'Contact phone number',
        validation: 'string|max:20'
      },
      'organization': {
        name: 'organization',
        type: 'string',
        required: false,
        maxLength: 255,
        description: 'Company or organization name',
        validation: 'string|max:255'
      },
      'job_title': {
        name: 'job_title',
        type: 'string',
        required: false,
        maxLength: 100,
        description: 'Job title or position',
        validation: 'string|max:100'
      },
      'attendance_type': {
        name: 'attendance_type',
        type: 'string',
        required: true,
        description: 'How attendee plans to attend (in-person, virtual, hybrid)',
        validation: 'required|in:in_person,virtual,hybrid'
      },
      'dietary_restrictions': {
        name: 'dietary_restrictions',
        type: 'json',
        required: false,
        description: 'Selected dietary restrictions as JSON array',
        validation: 'array'
      },
      'special_requirements': {
        name: 'special_requirements',
        type: 'text',
        required: false,
        description: 'Special accommodation requests',
        validation: 'string|max:1000'
      },
      'registration_date': {
        name: 'registration_date',
        type: 'datetime',
        required: true,
        description: 'When the registration was submitted',
        validation: 'required|date'
      },
      'is_confirmed': {
        name: 'is_confirmed',
        type: 'boolean',
        required: false,
        description: 'Whether registration is confirmed',
        validation: 'boolean'
      }
    }
  },

  'exhibitor-registration': {
    name: 'exhibitor_registrations',
    displayName: 'Exhibitor Registrations',
    description: 'Complete exhibitor company and booth information',
    fields: {
      'company_name': {
        name: 'company_name',
        type: 'string',
        required: true,
        maxLength: 255,
        description: 'Official company name',
        validation: 'required|string|max:255'
      },
      'contact_first_name': {
        name: 'contact_first_name',
        type: 'string',
        required: true,
        maxLength: 100,
        description: 'Primary contact first name',
        validation: 'required|string|max:100'
      },
      'contact_last_name': {
        name: 'contact_last_name',
        type: 'string',
        required: true,
        maxLength: 100,
        description: 'Primary contact last name',
        validation: 'required|string|max:100'
      },
      'contact_email': {
        name: 'contact_email',
        type: 'string',
        required: true,
        maxLength: 255,
        description: 'Primary contact email',
        validation: 'required|email|max:255'
      },
      'contact_phone': {
        name: 'contact_phone',
        type: 'string',
        required: true,
        maxLength: 20,
        description: 'Primary contact phone',
        validation: 'required|string|max:20'
      },
      'industry_category': {
        name: 'industry_category',
        type: 'string',
        required: true,
        maxLength: 100,
        description: 'Business industry category',
        validation: 'required|string|max:100'
      },
      'products_services': {
        name: 'products_services',
        type: 'text',
        required: true,
        description: 'Description of products/services to exhibit',
        validation: 'required|string|max:2500'
      },
      'booth_size': {
        name: 'booth_size',
        type: 'string',
        required: true,
        description: 'Preferred booth size category',
        validation: 'required|in:small,medium,large,premium,custom'
      },
      'booth_location_preference': {
        name: 'booth_location_preference',
        type: 'string',
        required: false,
        maxLength: 100,
        description: 'Preferred booth location or area',
        validation: 'string|max:100'
      },
      'power_requirements': {
        name: 'power_requirements',
        type: 'json',
        required: false,
        description: 'Selected power requirements as JSON array',
        validation: 'array'
      },
      'additional_services': {
        name: 'additional_services',
        type: 'json',
        required: false,
        description: 'Selected additional services as JSON array',
        validation: 'array'
      },
      'setup_requirements': {
        name: 'setup_requirements',
        type: 'text',
        required: false,
        description: 'Special setup and logistics requirements',
        validation: 'string|max:1000'
      },
      'estimated_attendees': {
        name: 'estimated_attendees',
        type: 'number',
        required: false,
        description: 'Expected number of booth visitors',
        validation: 'integer|min:0|max:10000'
      },
      'years_in_business': {
        name: 'years_in_business',
        type: 'number',
        required: false,
        description: 'Number of years company has been in business',
        validation: 'integer|min:0|max:200'
      },
      'website_url': {
        name: 'website_url',
        type: 'string',
        required: false,
        maxLength: 255,
        description: 'Company website URL',
        validation: 'url|max:255'
      }
    }
  },

  'general': {
    name: 'general_forms',
    displayName: 'General Forms',
    description: 'General purpose form data',
    fields: {
      'full_name': {
        name: 'full_name',
        type: 'string',
        required: true,
        maxLength: 255,
        description: 'Full name of the respondent',
        validation: 'required|string|max:255'
      },
      'email': {
        name: 'email',
        type: 'string',
        required: false,
        maxLength: 255,
        description: 'Email address',
        validation: 'email|max:255'
      },
      'message': {
        name: 'message',
        type: 'text',
        required: false,
        description: 'Message or feedback',
        validation: 'string|max:2000'
      },
      'submitted_at': {
        name: 'submitted_at',
        type: 'datetime',
        required: true,
        description: 'Submission date and time',
        validation: 'required|date'
      }
    }
  }
};

// Helper functions
export const getPrimaryTable = (formType?: FormUsageType): DatabaseTable | null => {
  return formType ? DATABASE_SCHEMAS[formType] : null;
};

export const getTableName = (formType?: FormUsageType): string => {
  return formType ? DATABASE_SCHEMAS[formType].name : '';
};

export const getTableDisplayName = (formType?: FormUsageType): string => {
  return formType ? DATABASE_SCHEMAS[formType].displayName : '';
};

export const getAvailableFieldsForFormType = (formType?: FormUsageType): DatabaseField[] => {
  if (!formType) return [];
  const table = DATABASE_SCHEMAS[formType];
  return table ? Object.values(table.fields) : [];
};

export const getFieldNamesForFormType = (formType?: FormUsageType): string[] => {
  if (!formType) return [];
  const table = DATABASE_SCHEMAS[formType];
  return table ? Object.keys(table.fields) : [];
};

export const getDatabaseField = (formType?: FormUsageType, fieldName?: string): DatabaseField | undefined => {
  if (!formType || !fieldName) return undefined;
  const table = DATABASE_SCHEMAS[formType];
  return table?.fields[fieldName];
};

export const isFormFieldCompatibleWithDatabaseField = (formFieldType: string, databaseFieldType: DatabaseFieldType): boolean => {
  return COMPATIBLE_FORM_FIELDS[databaseFieldType]?.includes(formFieldType) || false;
};

export const getCompatibleFormFieldTypes = (databaseFieldType: DatabaseFieldType): string[] => {
  return COMPATIBLE_FORM_FIELDS[databaseFieldType] || [];
};

export const getCompatibleDatabaseFieldTypes = (formFieldType: string): DatabaseFieldType[] => {
  return FORM_FIELD_TO_DATABASE_TYPES[formFieldType] || [];
};

export const getCompatibleDatabaseFieldsForFormField = (formType?: FormUsageType, formFieldType?: string): DatabaseField[] => {
  if (!formType || !formFieldType) return [];
  const allFields = getAvailableFieldsForFormType(formType);
  const compatibleTypes = getCompatibleDatabaseFieldTypes(formFieldType);
  
  return allFields.filter(field => compatibleTypes.includes(field.type));
};
