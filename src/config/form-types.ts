import { FormTypeConfig, FormUsageType, PreconfiguredField, FieldMapping } from '@/types/form-templates';

// Common validation patterns
const COMMON_VALIDATIONS = {
  required: {
    custom: {
      required: { value: true, message: 'This field is required', type: 'binary' as const }
    }
  },
  email: {
    custom: {
      required: { value: true, message: 'Email is required', type: 'binary' as const },
      email: { value: true, message: 'Please enter a valid email address', type: 'binary' as const }
    }
  },
  phone: {
    custom: {
      required: { value: true, message: 'Phone number is required', type: 'binary' as const },
      pattern: { 
        value: '^[\\d\\s\\+\\-\\(\\)]+$', 
        message: 'Please enter a valid phone number', 
        type: 'withValue' as const 
      }
    }
  }
};

// Event Registration Configuration
const eventRegistrationFields: PreconfiguredField[] = [
  {
    id: 'first_name',
    name: 'first_name',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter your first name',
    helperText: 'Your legal first name',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    width: '50%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'first_name',
      validation: 'required|string|max:100',
      required: true
    },
    category: 'basic'
  },
  {
    id: 'last_name',
    name: 'last_name',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter your last name',
    helperText: 'Your legal last name',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    width: '50%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'last_name',
      validation: 'required|string|max:100',
      required: true
    },
    category: 'basic'
  },
  {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email address',
    helperText: 'We will send confirmation details to this email',
    required: true,
    validation: COMMON_VALIDATIONS.email,
    width: '100%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'email',
      validation: 'required|email|max:255',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'phone',
    name: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    helperText: 'Include country code if international',
    required: true,
    validation: COMMON_VALIDATIONS.phone,
    width: '50%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'phone',
      validation: 'required|string|max:20',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'organization',
    name: 'organization',
    type: 'text',
    label: 'Organization/Company',
    placeholder: 'Enter your organization name',
    helperText: 'The company or organization you represent',
    required: false,
    width: '50%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'organization',
      validation: 'string|max:255',
      required: false
    },
    category: 'business'
  },
  {
    id: 'job_title',
    name: 'job_title',
    type: 'text',
    label: 'Job Title',
    placeholder: 'Enter your job title',
    helperText: 'Your current position or role',
    required: false,
    width: '50%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'job_title',
      validation: 'string|max:100',
      required: false
    },
    category: 'business'
  },
  {
    id: 'attendance_type',
    name: 'attendance_type',
    type: 'radio',
    label: 'Attendance Type',
    helperText: 'How do you plan to attend the event?',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    options: [
      { label: 'In-Person', value: 'in_person', helperText: 'Attend physically at the venue' },
      { label: 'Virtual', value: 'virtual', helperText: 'Attend online via live stream' },
      { label: 'Hybrid', value: 'hybrid', helperText: 'Mix of in-person and virtual attendance' }
    ],
    width: '100%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'attendance_type',
      validation: 'required|in:in_person,virtual,hybrid',
      required: true
    },
    category: 'event'
  },
  {
    id: 'dietary_restrictions',
    name: 'dietary_restrictions',
    type: 'checkbox',
    label: 'Dietary Restrictions',
    helperText: 'Select any dietary restrictions (for catering purposes)',
    required: false,
    options: [
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Gluten-Free', value: 'gluten_free' },
      { label: 'Halal', value: 'halal' },
      { label: 'Kosher', value: 'kosher' },
      { label: 'No Restrictions', value: 'none' }
    ],
    width: '100%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'dietary_restrictions',
      validation: 'array',
      transform: 'json_encode',
      required: false
    },
    category: 'preferences'
  },
  {
    id: 'special_requirements',
    name: 'special_requirements',
    type: 'textarea',
    label: 'Special Requirements',
    placeholder: 'Please describe any special accommodations needed...',
    helperText: 'Accessibility needs, assistance requirements, etc.',
    required: false,
    width: '100%',
    mapping: {
      targetTable: 'event_registrations',
      targetField: 'special_requirements',
      validation: 'string|max:1000',
      required: false
    },
    category: 'additional'
  }
];

// Exhibitor Registration Configuration
const exhibitorRegistrationFields: PreconfiguredField[] = [
  {
    id: 'company_name',
    name: 'company_name',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter your company name',
    helperText: 'Official registered company name',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    width: '100%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'company_name',
      validation: 'required|string|max:255',
      required: true
    },
    category: 'business'
  },
  {
    id: 'contact_person_first_name',
    name: 'contact_person_first_name',
    type: 'text',
    label: 'Contact Person First Name',
    placeholder: 'Enter first name',
    helperText: 'Primary contact for this exhibition',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    width: '50%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'contact_first_name',
      validation: 'required|string|max:100',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'contact_person_last_name',
    name: 'contact_person_last_name',
    type: 'text',
    label: 'Contact Person Last Name',
    placeholder: 'Enter last name',
    helperText: 'Primary contact for this exhibition',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    width: '50%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'contact_last_name',
      validation: 'required|string|max:100',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'contact_email',
    name: 'contact_email',
    type: 'email',
    label: 'Contact Email',
    placeholder: 'Enter contact email',
    helperText: 'Primary email for all exhibition communications',
    required: true,
    validation: COMMON_VALIDATIONS.email,
    width: '50%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'contact_email',
      validation: 'required|email|max:255',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'contact_phone',
    name: 'contact_phone',
    type: 'phone',
    label: 'Contact Phone',
    placeholder: 'Enter contact phone number',
    helperText: 'Primary phone number for urgent communications',
    required: true,
    validation: COMMON_VALIDATIONS.phone,
    width: '50%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'contact_phone',
      validation: 'required|string|max:20',
      required: true
    },
    category: 'contact'
  },
  {
    id: 'booth_size',
    name: 'booth_size',
    type: 'dropdown',
    label: 'Booth Size Preference',
    placeholder: 'Select booth size',
    helperText: 'Choose your preferred exhibition space size',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    options: [
      { label: 'Small (3x3m)', value: 'small', helperText: 'Standard small booth - 9 sq meters' },
      { label: 'Medium (3x6m)', value: 'medium', helperText: 'Medium booth - 18 sq meters' },
      { label: 'Large (6x6m)', value: 'large', helperText: 'Large booth - 36 sq meters' },
      { label: 'Premium (6x9m)', value: 'premium', helperText: 'Premium booth - 54 sq meters' },
      { label: 'Custom', value: 'custom', helperText: 'Custom size - please specify in requirements' }
    ],
    width: '50%',
    mapping: {
      targetTable: 'exhibition_details',
      targetField: 'booth_size',
      validation: 'required|in:small,medium,large,premium,custom',
      required: true
    },
    category: 'event'
  },
  {
    id: 'industry_category',
    name: 'industry_category',
    type: 'dropdown',
    label: 'Industry Category',
    placeholder: 'Select your industry',
    helperText: 'Primary industry category for your business',
    required: true,
    validation: COMMON_VALIDATIONS.required,
    options: [
      { label: 'Technology', value: 'technology' },
      { label: 'Healthcare', value: 'healthcare' },
      { label: 'Finance', value: 'finance' },
      { label: 'Manufacturing', value: 'manufacturing' },
      { label: 'Retail', value: 'retail' },
      { label: 'Education', value: 'education' },
      { label: 'Food & Beverage', value: 'food_beverage' },
      { label: 'Automotive', value: 'automotive' },
      { label: 'Construction', value: 'construction' },
      { label: 'Other', value: 'other' }
    ],
    width: '50%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'industry_category',
      validation: 'required|string|max:100',
      required: true
    },
    category: 'business'
  },
  {
    id: 'products_services',
    name: 'products_services',
    type: 'textarea',
    label: 'Products/Services Description',
    placeholder: 'Describe the products or services you will be showcasing...',
    helperText: 'Brief description of what you will exhibit (max 500 words)',
    required: true,
    validation: {
      custom: {
        required: { value: true, message: 'Description is required', type: 'binary' as const },
        maxLength: { value: 2500, message: 'Description must be under 500 words', type: 'withValue' as const }
      }
    },
    width: '100%',
    mapping: {
      targetTable: 'exhibitor_registrations',
      targetField: 'products_services',
      validation: 'required|string|max:2500',
      required: true
    },
    category: 'business'
  },
  {
    id: 'power_requirements',
    name: 'power_requirements',
    type: 'checkbox',
    label: 'Power Requirements',
    helperText: 'Select your electrical power needs',
    required: false,
    options: [
      { label: 'Standard Power (13A)', value: 'standard' },
      { label: 'High Power (32A)', value: 'high_power' },
      { label: 'Three Phase', value: 'three_phase' },
      { label: 'No Power Required', value: 'none' }
    ],
    width: '50%',
    mapping: {
      targetTable: 'exhibition_details',
      targetField: 'power_requirements',
      validation: 'array',
      transform: 'json_encode',
      required: false
    },
    category: 'event'
  },
  {
    id: 'additional_services',
    name: 'additional_services',
    type: 'checkbox',
    label: 'Additional Services',
    helperText: 'Select any additional services you require',
    required: false,
    options: [
      { label: 'Furniture Rental', value: 'furniture' },
      { label: 'Audio/Visual Equipment', value: 'av_equipment' },
      { label: 'Internet Connection', value: 'internet' },
      { label: 'Security Services', value: 'security' },
      { label: 'Cleaning Services', value: 'cleaning' },
      { label: 'Storage Space', value: 'storage' }
    ],
    width: '50%',
    mapping: {
      targetTable: 'exhibition_details',
      targetField: 'additional_services',
      validation: 'array',
      transform: 'json_encode',
      required: false
    },
    category: 'event'
  },
  {
    id: 'special_requirements',
    name: 'special_requirements',
    type: 'textarea',
    label: 'Special Requirements',
    placeholder: 'Please describe any special setup requirements, accessibility needs, or other requests...',
    helperText: 'Any special setup, accessibility, or logistics requirements',
    required: false,
    width: '100%',
    mapping: {
      targetTable: 'exhibition_details',
      targetField: 'special_requirements',
      validation: 'string|max:1000',
      required: false
    },
    category: 'additional'
  }
];

// Form Type Configurations - Simplified initial version with only essential types
export const FORM_TYPE_CONFIGS: Record<FormUsageType, FormTypeConfig> = {
  'event-registration': {
    id: 'event-registration',
    name: 'Event Registration',
    description: 'Collect attendee information for events, conferences, and workshops',
    icon: '🎪',
    category: 'event',
    fieldMappings: {
      first_name: {
        targetTable: 'event_registrations',
        targetField: 'first_name',
        validation: 'required|string|max:100',
        required: true
      },
      last_name: {
        targetTable: 'event_registrations',
        targetField: 'last_name',
        validation: 'required|string|max:100',
        required: true
      },
      email: {
        targetTable: 'event_registrations',
        targetField: 'email',
        validation: 'required|email|max:255',
        required: true
      },
      phone: {
        targetTable: 'event_registrations',
        targetField: 'phone',
        validation: 'string|max:20',
        required: false
      },
      organization: {
        targetTable: 'event_registrations',
        targetField: 'organization',
        validation: 'string|max:255',
        required: false
      },
      job_title: {
        targetTable: 'event_registrations',
        targetField: 'job_title',
        validation: 'string|max:100',
        required: false
      },
      attendance_type: {
        targetTable: 'event_registrations',
        targetField: 'attendance_type',
        validation: 'required|in:in_person,virtual,hybrid',
        required: true
      },
      dietary_restrictions: {
        targetTable: 'event_registrations',
        targetField: 'dietary_restrictions',
        validation: 'array',
        transform: 'json_encode',
        required: false
      },
      special_requirements: {
        targetTable: 'event_registrations',
        targetField: 'special_requirements',
        validation: 'string|max:1000',
        required: false
      }
    },
    requiredMappings: ['first_name', 'last_name', 'email', 'attendance_type'],
    conditionalFields: {
      special_requirements: {
        dependsOn: 'attendance_type',
        showWhen: 'in_person'
      }
    },
    preconfiguredFields: eventRegistrationFields
  },

  'exhibitor-registration': {
    id: 'exhibitor-registration',
    name: 'Exhibitor Registration',
    description: 'Register companies and organizations for exhibition spaces',
    icon: '🏢',
    category: 'event',
    fieldMappings: {
      company_name: {
        targetTable: 'exhibitor_registrations',
        targetField: 'company_name',
        validation: 'required|string|max:255',
        required: true
      },
      contact_person_first_name: {
        targetTable: 'exhibitor_registrations',
        targetField: 'contact_first_name',
        validation: 'required|string|max:100',
        required: true
      },
      contact_person_last_name: {
        targetTable: 'exhibitor_registrations',
        targetField: 'contact_last_name',
        validation: 'required|string|max:100',
        required: true
      },
      contact_email: {
        targetTable: 'exhibitor_registrations',
        targetField: 'contact_email',
        validation: 'required|email|max:255',
        required: true
      },
      contact_phone: {
        targetTable: 'exhibitor_registrations',
        targetField: 'contact_phone',
        validation: 'required|string|max:20',
        required: true
      },
      industry_category: {
        targetTable: 'exhibitor_registrations',
        targetField: 'industry_category',
        validation: 'required|string|max:100',
        required: true
      },
      products_services: {
        targetTable: 'exhibitor_registrations',
        targetField: 'products_services',
        validation: 'required|string|max:2500',
        required: true
      },
      booth_size: {
        targetTable: 'exhibitor_registrations',
        targetField: 'booth_size',
        validation: 'required|in:small,medium,large,premium,custom',
        required: true
      },
      booth_location_preference: {
        targetTable: 'exhibitor_registrations',
        targetField: 'booth_location_preference',
        validation: 'string|max:100',
        required: false
      },
      power_requirements: {
        targetTable: 'exhibitor_registrations',
        targetField: 'power_requirements',
        validation: 'array',
        transform: 'json_encode',
        required: false
      },
      additional_services: {
        targetTable: 'exhibitor_registrations',
        targetField: 'additional_services',
        validation: 'array',
        transform: 'json_encode',
        required: false
      },
      setup_requirements: {
        targetTable: 'exhibitor_registrations',
        targetField: 'setup_requirements',
        validation: 'string|max:1000',
        required: false
      },
      estimated_attendees: {
        targetTable: 'exhibitor_registrations',
        targetField: 'estimated_attendees',
        validation: 'integer|min:0|max:10000',
        required: false
      },
      years_in_business: {
        targetTable: 'exhibitor_registrations',
        targetField: 'years_in_business',
        validation: 'integer|min:0|max:200',
        required: false
      },
      website_url: {
        targetTable: 'exhibitor_registrations',
        targetField: 'website_url',
        validation: 'url|max:255',
        required: false
      }
    },
    requiredMappings: ['company_name', 'contact_person_first_name', 'contact_person_last_name', 'contact_email', 'contact_phone', 'industry_category', 'products_services', 'booth_size'],
    conditionalFields: {
      power_requirements: {
        dependsOn: 'booth_size',
        showWhen: ['medium', 'large', 'premium', 'custom']
      }
    },
    preconfiguredFields: exhibitorRegistrationFields
  }
};

// Helper function to get form type by ID
export const getFormTypeConfig = (formType: FormUsageType): FormTypeConfig => {
  return FORM_TYPE_CONFIGS[formType];
};

// Helper function to get all form types for a category
export const getFormTypesByCategory = (category: string) => {
  return Object.values(FORM_TYPE_CONFIGS).filter(config => config.category === category);
};

// Helper function to get field mapping for a specific field
export const getFieldMapping = (formType: FormUsageType, fieldName: string): FieldMapping | undefined => {
  return FORM_TYPE_CONFIGS[formType]?.fieldMappings[fieldName];
};
