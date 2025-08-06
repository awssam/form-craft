import FieldRegistry from './FieldRegistry';
import { initializeDefaultCategories } from './FieldCategories';

// Import all specialized field components
import TextField from './specialized/TextField';
import EmailField from './specialized/EmailField';
import PhoneField from './specialized/PhoneField';
import NumberField from './specialized/NumberField';
import TextareaField from './specialized/TextareaField';
import DropdownField from './specialized/DropdownField';
import RadioField from './specialized/RadioField';
import CheckboxField from './specialized/CheckboxField';
import DateField from './specialized/DateField';
import DatetimeField from './specialized/DatetimeField';
import FileField from './specialized/FileField';

// Import validation rules
import { 
  RequiredValidation,
  MinLengthValidation,
  MaxLengthValidation,
  PatternValidation,
  EmailValidation,
  PhoneValidation,
  NumberValidation,
  DateValidation,
  FileValidation,
  OptionsValidation
} from './validation/ValidationRules';

// Import icons (you may need to adjust these imports based on your icon library)
import { 
  Type, 
  Mail, 
  Phone, 
  Hash, 
  FileText, 
  ChevronDown, 
  Circle, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Upload 
} from 'lucide-react';
import { FieldConfiguration } from './base/FieldTypes';

// Individual field configurations
const textFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Type className="w-4 h-4" />,
  displayName: 'Text Field',
  description: 'Single-line text input for short entries',
  category: 'basic',
  tags: ['input', 'text', 'string'],
  defaultConfig: {
    placeholder: 'Enter text...',
    helperText: 'Type your answer here',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    MinLengthValidation,
    MaxLengthValidation,
    PatternValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'width', type: 'select', label: 'Field Width', options: [
      { label: '25%', value: '25%' },
      { label: '50%', value: '50%' },
      { label: '75%', value: '75%' },
      { label: '100%', value: '100%' }
    ] },
  ],
};

const emailFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Mail className="w-4 h-4" />,
  displayName: 'Email Field',
  description: 'Email input with validation and domain suggestions',
  category: 'contact',
  tags: ['email', 'contact', 'validation'],
  defaultConfig: {
    placeholder: 'Enter your email...',
    helperText: 'We will send confirmations to this email',
    width: '100%',
    validation: {
      custom: {
        required: { value: true, message: 'Email is required', type: 'binary' },
        email: { value: true, message: 'Enter a valid email', type: 'binary' },
      }
    }
  },
  validationRules: [
    RequiredValidation,
    EmailValidation,
    PatternValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'allowedDomains', type: 'array', label: 'Allowed Domains' },
  ],
};

const phoneFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Phone className="w-4 h-4" />,
  displayName: 'Phone Field',
  description: 'Phone number input with formatting and validation',
  category: 'contact',
  tags: ['phone', 'contact', 'number', 'validation'],
  defaultConfig: {
    placeholder: 'Enter phone number...',
    helperText: 'Include area code for best results',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    PhoneValidation,
    PatternValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'countryCode', type: 'select', label: 'Default Country', options: [
      { label: 'US', value: 'US' },
      { label: 'CA', value: 'CA' },
      { label: 'UK', value: 'UK' },
      { label: 'AU', value: 'AU' }
    ] },
  ],
};

const numberFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Hash className="w-4 h-4" />,
  displayName: 'Number Field',
  description: 'Numeric input with constraints and formatting',
  category: 'numeric',
  tags: ['number', 'numeric', 'integer', 'decimal'],
  defaultConfig: {
    placeholder: 'Enter number...',
    helperText: 'Enter a numeric value',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    NumberValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'min', type: 'number', label: 'Minimum Value' },
    { key: 'max', type: 'number', label: 'Maximum Value' },
    { key: 'step', type: 'number', label: 'Step Value' },
  ],
};

const textareaFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <FileText className="w-4 h-4" />,
  displayName: 'Textarea Field',
  description: 'Multi-line text input for longer entries',
  category: 'basic',
  tags: ['textarea', 'text', 'multiline', 'long'],
  defaultConfig: {
    placeholder: 'Enter your message...',
    helperText: 'Provide detailed information',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    MinLengthValidation,
    MaxLengthValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'rows', type: 'number', label: 'Number of Rows' },
    { key: 'maxLength', type: 'number', label: 'Maximum Characters' },
  ],
};

const dropdownFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <ChevronDown className="w-4 h-4" />,
  displayName: 'Dropdown Field',
  description: 'Select from predefined options with search support',
  category: 'selection',
  tags: ['dropdown', 'select', 'options', 'choice'],
  defaultConfig: {
    placeholder: 'Select an option...',
    helperText: 'Choose from the available options',
    width: '100%',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  validationRules: [
    RequiredValidation,
    OptionsValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'allowMultiple', type: 'boolean', label: 'Allow Multiple Selection' },
    { key: 'searchable', type: 'boolean', label: 'Enable Search' },
  ],
};

const radioFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Circle className="w-4 h-4" />,
  displayName: 'Radio Field',
  description: 'Single selection from multiple options',
  category: 'selection',
  tags: ['radio', 'options', 'single', 'choice'],
  defaultConfig: {
    helperText: 'Select one option',
    width: '100%',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  validationRules: [
    RequiredValidation,
    OptionsValidation,
  ],
  customizations: [
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'layout', type: 'select', label: 'Layout', options: [
      { label: 'Vertical', value: 'vertical' },
      { label: 'Horizontal', value: 'horizontal' },
      { label: 'Grid', value: 'grid' }
    ] },
    { key: 'allowDeselect', type: 'boolean', label: 'Allow Deselection' },
  ],
};

const checkboxFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <CheckSquare className="w-4 h-4" />,
  displayName: 'Checkbox Field',
  description: 'Multiple selection or single agreement checkbox',
  category: 'selection',
  tags: ['checkbox', 'options', 'multiple', 'agreement'],
  defaultConfig: {
    helperText: 'Check all that apply',
    width: '100%',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
  },
  validationRules: [
    RequiredValidation,
    OptionsValidation,
  ],
  customizations: [
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'variant', type: 'select', label: 'Variant', options: [
      { label: 'Single', value: 'single' },
      { label: 'Multiple', value: 'multiple' }
    ] },
    { key: 'layout', type: 'select', label: 'Layout', options: [
      { label: 'Vertical', value: 'vertical' },
      { label: 'Horizontal', value: 'horizontal' },
      { label: 'Grid', value: 'grid' }
    ] },
  ],
};

const dateFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Calendar className="w-4 h-4" />,
  displayName: 'Date Field',
  description: 'Date picker with calendar interface',
  category: 'datetime',
  tags: ['date', 'calendar', 'picker', 'datetime'],
  defaultConfig: {
    placeholder: 'Select a date...',
    helperText: 'Choose a date from the calendar',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    DateValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'dateFormat', type: 'select', label: 'Date Format', options: [
      { label: 'yyyy-MM-dd', value: 'yyyy-MM-dd' },
      { label: 'MM/dd/yyyy', value: 'MM/dd/yyyy' },
      { label: 'dd/MM/yyyy', value: 'dd/MM/yyyy' }
    ] },
    { key: 'minDate', type: 'text', label: 'Minimum Date' },
    { key: 'maxDate', type: 'text', label: 'Maximum Date' },
  ],
};

const datetimeFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Clock className="w-4 h-4" />,
  displayName: 'DateTime Field',
  description: 'Date and time picker with full control',
  category: 'datetime',
  tags: ['datetime', 'time', 'calendar', 'picker'],
  defaultConfig: {
    placeholder: 'Select date and time...',
    helperText: 'Choose both date and time',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    DateValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'datetimeFormat', type: 'text', label: 'DateTime Format' },
    { key: 'showSeconds', type: 'boolean', label: 'Show Seconds' },
    { key: 'use24HourFormat', type: 'boolean', label: 'Use 24-hour Format' },
  ],
};

const fileFieldConfig: Omit<FieldConfiguration, "type" | "component"> = {
  icon: <Upload className="w-4 h-4" />,
  displayName: 'File Upload',
  description: 'File upload with drag & drop and validation',
  category: 'media',
  tags: ['file', 'upload', 'attachment', 'media'],
  defaultConfig: {
    helperText: 'Upload files by clicking or dragging them here',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    FileValidation,
  ],
  customizations: [
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'allowMultiple', type: 'boolean', label: 'Allow Multiple Files' },
    { key: 'maxFileSize', type: 'number', label: 'Max File Size (bytes)' },
    { key: 'acceptedFileTypes', type: 'array', label: 'Accepted File Types' },
  ],
};
/**
 * Register all specialized field components with the registry
 */
export function registerSpecializedFields(): void {
  console.log('🚀 Starting field registration...');

  // Register each field component with its configuration
  console.log('📝 Registering text field...');
  FieldRegistry.registerWithComponent('text', textFieldConfig, TextField);
  
  console.log('📝 Registering email field...');
  FieldRegistry.registerWithComponent('email', emailFieldConfig, EmailField);
  
  console.log('📝 Registering phone field...');
  FieldRegistry.registerWithComponent('phone', phoneFieldConfig, PhoneField);
  
  console.log('📝 Registering number field...');
  FieldRegistry.registerWithComponent('number', numberFieldConfig, NumberField);
  
  console.log('📝 Registering textarea field...');
  FieldRegistry.registerWithComponent('textarea', textareaFieldConfig, TextareaField);
  
  console.log('📝 Registering dropdown field...');
  FieldRegistry.registerWithComponent('dropdown', dropdownFieldConfig, DropdownField);
  
  console.log('📝 Registering radio field...');
  FieldRegistry.registerWithComponent('radio', radioFieldConfig, RadioField);
  
  console.log('📝 Registering checkbox field...');
  FieldRegistry.registerWithComponent('checkbox', checkboxFieldConfig, CheckboxField);
  
  console.log('📝 Registering date field...');
  FieldRegistry.registerWithComponent('date', dateFieldConfig, DateField);
  
  console.log('📝 Registering datetime field...');
  FieldRegistry.registerWithComponent('datetime', datetimeFieldConfig, DatetimeField);
  
  console.log('📝 Registering file field...');
  FieldRegistry.registerWithComponent('file', fileFieldConfig, FileField);

  console.log('✅ All specialized field components registered successfully');
  
  // Log registration statistics
  const stats = FieldRegistry.getEnhancedStats();
  console.log(`📊 Registry stats: ${stats.totalFields} fields, ${stats.totalCategories} categories`);
  
  // Verify field registration
  const allFields = FieldRegistry.getAllFields();
  console.log('🔍 Verified registered fields:', allFields.length);
}

/**
 * Initialize the field registry with all specialized components
 * This function should be called once at application startup
 */
export function initializeFieldRegistry(): void {
  if (FieldRegistry.isInitialized()) {
    console.log('FieldRegistry already initialized');
    return;
  }

  try {
    // Initialize categories first
    initializeDefaultCategories();
    
    
    // Then register field components
    registerSpecializedFields();
    console.log('🚀 Field registry initialization complete');
  } catch (error) {
    console.error('❌ Failed to initialize field registry:', error);
    throw error;
  }
}

// Auto-initialize when this module is imported
initializeFieldRegistry();
