export interface FormConfig {
  id: string; // Unique identifier for the form
  name: string; // Name of the form
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

export type Theme =
| "midnight-black" 
  | "deep-space" 
  | "charcoal-black" 
  | "deep-violet" 
  | "night-sky";

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

type FormStatus = "draft" | "published";

interface PageEntity {
  id: string; // Unique identifier for the page
  name: string; // Name of the page
  fields: string[]; // Array of field IDs to maintain the order of appearance of fields
}

export interface FieldEntity {
  id: string; // Unique identifier for the field
  type: FieldType; // The type of the field (e.g., text, checkbox)
  label: string; // Label for the field
  placeholder?: string; // Placeholder text (optional, mainly for input fields)
  validation?: FieldValidation; // Validation rules for the field (optional)
  options?: FieldOption[]; // Options for fields like checkboxes, radios, dropdowns (optional)
  conditionalLogic?: ConditionalLogic; // Conditional logic for showing/hiding the field (optional)
  width?: FormFieldWidth;
}

type FieldType =
  | "text"
  | "checkbox"
  | "radio"
  | "dropdown"
  | "date"
  | "file"
  | "textarea";

interface FieldValidation {
  minLength?: {
    value: number; // Minimum length value
    message: string; // Custom error message for minLength
  };
  maxLength?: {
    value: number; // Maximum length value
    message: string; // Custom error message for maxLength
  };
  pattern?: {
    value: string; // Regex pattern to validate against
    message: string; // Custom error message for pattern mismatch
  };
  required?: {
    value: boolean; // Whether the field is required
    message: string; // Custom error message for required field
  };
}

interface FieldOption {
  label: string; // Display label for the option
  value: string | number; // Value associated with the option
  helperText: string;
}

type FormFieldWidth = "25%" | "50%" | "75%" | "100%";

interface ConditionalLogic {
  showWhen: {
    fieldId: string; // The ID of the field whose value triggers the condition
    value: string | number | boolean; // The value that triggers the condition
  };
}

interface FormSettings {
  submission: {
    emailNotifications: boolean; // Whether email notifications are enabled on submission
    redirectURL: string; // URL to redirect to after submission
  };
  fileUploadLimit: string; // File upload limit, e.g., "5MB"
}

interface FormStyles {
  fontFamily?: string;
  backgroundColor?: string;
  fontPrimaryColor?: string;
  fontSecondaryColor?: string;
}
