// Base components and types
export { default as BaseField, useFieldContext, withFieldContext } from './base/BaseField';
export { default as FieldWrapper, withFieldWrapper } from './base/FieldWrapper';
export type {
  BaseFieldProps,
  FieldConfiguration,
  FieldCategory,
  ValidationRule,
  ValidationRuleProps,
  CustomizationOption,
  FieldRendererProps,
  FieldContext,
  FieldWrapperProps,
  FieldError,
  FieldState,
} from './base/FieldTypes';

// Enhanced Registry with component support
export { 
  default as FieldRegistry,
  type FieldComponent,
  type EnhancedFieldConfiguration,
  type FieldRegistrationOptions
} from './FieldRegistry';

// Validation System (Phase 4)
export { 
  default as ValidationRegistry,
  type ValidationComponent,
  type ValidationComponentProps,
  type ValidationRuleWithComponent,
  type ValidationChangeData
} from './validation/ValidationRegistry';

export {
  RequiredValidation,
  MinLengthValidation,
  ALL_VALIDATION_RULES
} from './validation/ValidationRules';

export {
  useValidationRegistry,
  useFieldValidations,
  useValidationStats,
  useValidationRegistrySubscription
} from './validation/useValidationRegistry';

// Demo Components
export { default as FieldSystemDemo } from './FieldSystemDemo';
export { default as ValidationSystemDemo } from './ValidationSystemDemo';

// Field Registration System
export {
  registerSpecializedFields,
  initializeFieldRegistry,
  FIELD_CONFIGURATIONS
} from './FieldRegistrations';

// Categories
export { DEFAULT_FIELD_CATEGORIES, initializeDefaultCategories } from './FieldCategories';

// Enhanced Renderer with lazy loading support
export { 
  default as FieldRenderer, 
  FieldRendererWithErrorBoundary,
  useFieldConfig,
  useAvailableFieldTypes,
  useFieldsByCategory,
  useSearchFields,
  useRegistryStats,
  useRegistryReady,
} from './FieldRenderer';

// Re-export specialized fields (Phase 2 complete!)
export { default as TextField } from './specialized/TextField';
export { default as EmailField } from './specialized/EmailField';
export { default as PhoneField } from './specialized/PhoneField';
export { default as NumberField } from './specialized/NumberField';
export { default as TextareaField } from './specialized/TextareaField';
export { default as DropdownField } from './specialized/DropdownField';
export { default as RadioField } from './specialized/RadioField';
export { default as CheckboxField } from './specialized/CheckboxField';
export { default as DateField } from './specialized/DateField';
export { default as DatetimeField } from './specialized/DatetimeField';
export { default as FileField } from './specialized/FileField';

// Example and demo components
export { default as ExampleTextField } from './examples/ExampleTextField';
export { default as EnhancedFieldSystemDemo } from './examples/FieldSystemDemo';
