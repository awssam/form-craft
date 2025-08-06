/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldEntity, FieldValidation, FormTheme, FieldType } from '@/types/form-config';
import { GenericProps } from '@/types/common';
import { UseFormReturn } from 'react-hook-form';




/**
 * Validation change event data
 */
export interface ValidationChangeData {
  key: string;
  value: unknown;
  message?: string;
  enabled: boolean;
}

/**
 * Validation component props
 */
export interface ValidationComponentProps {
  field: FieldEntity;
  onValidationChange?: (validation: ValidationChangeData) => void;
  enabled?: boolean;
  value?: unknown;
  message?: string;
}

/**
 * Validation component type - React component that renders validation UI
 */
export type ValidationComponent = React.ComponentType<ValidationComponentProps>;



/**
 * validation rule with UI component
 */
export interface ValidationRuleWithComponent {
  key: string;
  label: string;
  description?: string;
  type: 'binary' | 'withValue' | 'complex';
  defaultValue?: unknown;
  defaultMessage?: string;
  component: ValidationComponent;
  category: 'basic' | 'advanced' | 'custom';
  dependencies?: string[]; // Other validation rules this depends on
  conflicts?: string[]; // Validation rules that conflict with this one
  validator: (value: unknown, fieldValue: unknown, fieldEntity: FieldEntity) => boolean | string;
}


/**
 * Base props that all field components should extend
 */
export interface BaseFieldProps extends GenericProps {
  /** Field configuration containing all field properties */
  config: FieldEntity;
  
  /** Rendering mode - builder for form creation, runtime for form submission */
  mode: 'builder' | 'runtime';
  
  /** Optional callback when field value changes */
  onChange?: (value: any) => void;
  
  /** Optional callback when field configuration changes (builder mode only) */
  onConfigChange?: (config: Partial<FieldEntity>) => void;
  
  /** Field validation configuration */
  validation?: FieldValidation;
  
  /** Form theme for styling */
  theme?: FormTheme;
  
  /** React Hook Form control (runtime mode only) */
  control?: UseFormReturn['control'];
  
  /** Whether this is an overlay field (builder mode) */
  isOverlay?: boolean;
  
  /** Page ID for form context */
  pageId?: string;
  
  /** Action disabler for form submission */
  actionDisabler?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Props for validation rule components
 */
export interface ValidationRuleProps {
  /** Current field configuration */
  field: FieldEntity;
  
  /** Current validation value */
  value?: any;
  
  /** Callback when validation changes */
  onChange: (value: any) => void;
  
  /** Whether this validation is enabled */
  enabled: boolean;
  
  /** Callback to enable/disable this validation */
  onEnabledChange: (enabled: boolean) => void;
}

/**
 * Customization option for field configuration
 */
export interface CustomizationOption {
  /** Unique key for the customization */
  key: string;
  
  /** Type of input for this customization */
  type: 'text' | 'number' | 'boolean' | 'select' | 'array' | 'color' | 'range';
  
  /** Display label */
  label: string;
  
  /** Help text explaining this option */
  description?: string;
  
  /** Default value */
  defaultValue?: any;
  
  /** Options for select type */
  options?: Array<{ label: string; value: any }>;
  
  /** Min/max values for number/range types */
  min?: number;
  max?: number;
  
  /** Step value for number/range types */
  step?: number;
  
  /** Whether this customization is required */
  required?: boolean;
  
  /** Validation function for the customization value */
  validate?: (value: any) => boolean | string;
}

/**
 * Field category for grouping fields in the UI
 */
export interface FieldCategory {
  /** Unique identifier */
  id: string;
  
  /** Display name */
  name: string;
  
  /** Description of fields in this category */
  description: string;
  
  /** Icon for the category */
  icon: React.ReactNode;
  
  /** Sort order */
  order: number;
}

/**
 * Complete field configuration for registration
 */
export interface FieldConfiguration {
  /** Field type identifier */
  type: FieldType;
  
  /** React component for rendering this field */
  component: React.ComponentType<BaseFieldProps>;
  
  /** Icon to display for this field type */
  icon: React.ReactNode;
  
  /** Display name for the field type */
  displayName: string;
  
  /** Description of what this field does */
  description: string;
  
  /** Category this field belongs to */
  category: string;
  
  /** Default configuration when creating a new field */
  defaultConfig: Partial<FieldEntity>;
  
  /** Available validation rules for this field type */
  validationRules: ValidationRuleWithComponent[];
  
  /** Available customization options */
  customizations: CustomizationOption[];
  
  /** Whether this field type is deprecated */
  deprecated?: boolean;
  
  /** Version when this field type was introduced */
  since?: string;
  
  /** Tags for searching/filtering */
  tags?: string[];
  
  /** Preview component for field list (optional) */
  previewComponent?: React.ComponentType<{ config: FieldEntity }>;
}

/**
 * Field renderer props for the central renderer
 */
export interface FieldRendererProps extends Omit<BaseFieldProps, 'config'> {
  /** Field configuration */
  fieldConfig: FieldEntity;
  
  /** Optional fallback component if field type is not registered */
  fallback?: React.ComponentType<BaseFieldProps>;
}

/**
 * Context for field rendering
 */
export interface FieldContext {
  /** Current field being rendered */
  field: FieldEntity;
  
  /** Form-wide theme */
  theme?: FormTheme;
  
  /** Whether we're in builder or runtime mode */
  mode: 'builder' | 'runtime';
  
  /** Form configuration */
  formConfig?: any;
  
  /** Field update handlers */
  updateField?: (fieldId: string, updates: Partial<FieldEntity>) => void;
  
  /** Field removal handler */
  removeField?: (fieldId: string) => void;
  
  /** Field duplication handler */
  duplicateField?: (fieldId: string) => void;
}

/**
 * Field wrapper props for common wrapper functionality
 */
export interface FieldWrapperProps {
  /** Child components to wrap */
  children: React.ReactNode;
  
  /** Field configuration */
  field: FieldEntity;
  
  /** Current mode */
  mode: 'builder' | 'runtime';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show field controls (builder mode) */
  showControls?: boolean;
  
  /** Whether field is selected (builder mode) */
  isSelected?: boolean;
  
  /** Selection handler */
  onSelect?: () => void;
  
  /** Whether this field can be dragged */
  isDraggable?: boolean;
  
  /** Drag handlers */
  dragHandlers?: {
    onDragStart?: () => void;
    onDragEnd?: () => void;
  };
}

/**
 * Form field error state
 */
export interface FieldError {
  /** Error message */
  message: string;
  
  /** Error type/code */
  type: string;
  
  /** Field that caused the error */
  field: string;
  
  /** Additional error context */
  context?: any;
}

/**
 * Field state for runtime forms
 */
export interface FieldState {
  /** Current field value */
  value: any;
  
  /** Whether field has been touched */
  touched: boolean;
  
  /** Current validation errors */
  errors: FieldError[];
  
  /** Whether field is currently being validated */
  isValidating: boolean;
  
  /** Whether field is disabled */
  disabled: boolean;
  
  /** Whether field is visible (conditional logic) */
  visible: boolean;
}
