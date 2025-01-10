export type FormConfigWithMeta = {
  meta: {
    title: string;
    description: string;
    status: string;
    submissions: number;
    lastModified: string;
  };
} & FormConfig;

export interface FormConfig {
  _id?: string;
  id: string; // Unique identifier for the form
  name: string; // Name of the form
  createdBy: string;
  description: string; // Description of the form
  image?: string; // URL of an image to display in the form
  status: FormStatus; // Status of the form
  tags?: string[]; // Array of tags for filtering purposes
  multiPage: boolean; // Whether the form is multi-page
  pages: string[]; // Array of page IDs to maintain page order
  pageEntities: Record<string, PageEntity>; // Mapping of page IDs to PageEntity objects
  fieldEntities: Record<string, FieldEntity>; // Mapping of field IDs to FieldEntity objects
  settings: FormSettings; // Form-level settings such as submission handling, file upload limit, etc.
  styles: FormStyles;
  theme: FormTheme;
}

export type Theme = 'midnight-black' | 'deep-space' | 'charcoal-black' | 'deep-violet' | 'night-sky';

export interface ThemeProperties {
  formBackgroundColor: string; // Background color for the form
  primaryTextColor: string; // Color for the main text
  secondaryTextColor: string; // Color for helper texts or secondary information
  inputPlaceholderColor: string; // Color for input field placeholders
  inputBorderColor: string; // Color for input field borders
  borderRadius: string; // Border radius for form elements
}
interface FormTheme {
  type: Theme;
  id: Theme;
  properties: ThemeProperties;
}

type FormStatus = 'draft' | 'published';

export interface PageEntity {
  id: string; // Unique identifier for the page
  name: string; // Name of the page
  fields: string[]; // Array of field IDs to maintain the order of appearance of fields
}

type ValueType = string | number | Date | boolean | string[];

export interface FieldEntity {
  id: string; // Unique identifier for the field,
  name: string; // Name of the field
  type: FieldType; // The type of the field (e.g., text, checkbox)
  label: string; // Label for the field
  placeholder?: string; // Placeholder text (optional, mainly for input fields)
  helperText?: string; // Helper text (optional, mainly for input fields)
  defaultValue?: ValueType; // Default value for the field
  readonly?: boolean; // Whether the field is read-only
  validation?: FieldValidation; // Validation rules for the field (optional)
  options?: FieldOption[]; // Options for fields like checkboxes, radios, dropdowns (optional)
  conditionalLogic?: ConditionalLogic; // Conditional logic for showing/hiding the field (optional)
  width: FormFieldWidth;
  value?: ValueType;
  allowMultiSelect?: boolean;
}

export type FieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'file' | 'textarea';

export type CustomValidationType = 'withValue' | 'binary';

export interface FieldValidation {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  validate?: Record<string, Function>;

  required?: {
    value: boolean; // Whether the field is required
    message: string; // Custom error message for required field
  };
  custom?: Record<
    string, // A unique key for the custom validation
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any; // The validation value (criteria)
      message: string; // The custom error message for this validation
      type: CustomValidationType;
    }
  >;
}

export interface FieldOption {
  label: string; // Display label for the option
  value: string | number; // Value associated with the option
  helperText?: string;
}

type FormFieldWidth = '25%' | '50%' | '75%' | '100%';

export interface ConditionalLogic {
  showWhen: {
    fieldId: string; // The ID of the field whose value triggers the condition
    operatorType: CustomValidationType;
    label: string;
    operator: ConditionalLogicOperator; // The operator for comparison
    value: string | number | boolean; // The value that triggers the condition
  }[];
  operator: 'AND' | 'OR';
}

export type ConditionalLogicOperator = string;

export interface FormSettings {
  submission: {
    emailNotifications: boolean; // Whether email notifications are enabled on submission
    redirectURL: string; // URL to redirect to after submission
  };
  fileUploadLimit: string; // File upload limit, e.g., "5MB"
}

export interface FormStyles {
  fontFamily?: string;
  backgroundColor?: string;
  fontPrimaryColor?: string;
  fontSecondaryColor?: string;
}
