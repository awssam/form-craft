import { FieldEntity } from './form-config';

export type FormUsageType =
  | 'event-registration'
   | 'general'
  | 'exhibitor-registration';

export interface FieldMapping {
  targetTable: string;
  targetField: string;
  validation?: string;
  transform?: string;
  required: boolean;
}

export interface EnhancedFieldMapping extends FieldMapping {
  id: string; // Unique mapping ID
  formFieldId: string; // ID of the form field
  formFieldType: string; // Type of the form field (text, email, etc.)
  databaseFieldType: string; // Type of the database field (string, number, etc.)
  isCustomMapping?: boolean; // Whether this is a user-defined mapping
  description?: string; // Description of what this mapping does
}

export interface PreconfiguredField extends Omit<FieldEntity, 'id'> {
  id: string;
  mapping: FieldMapping;
  category: string;
  helperText?: string;
  required: boolean;
}

export interface ConditionalFieldLogic {
  dependsOn: string;
  showWhen: string | string[];
}

export interface FormTypeConfig {
  id: FormUsageType;
  name: string;
  description: string;
  icon: string;
  category: string;
  fieldMappings: Record<string, FieldMapping>;
  requiredMappings: string[];
  conditionalFields?: Record<string, ConditionalFieldLogic>;
  preconfiguredFields: PreconfiguredField[];
  availableTables?: string[]; // Tables available for this form type
  defaultTable?: string; // Primary table for this form type
}

// Enhanced mapping configuration for user customization
export interface MappingConfiguration {
  formType: FormUsageType;
  mappings: Record<string, EnhancedFieldMapping>; // fieldId -> mapping
  usedTargetFields: Set<string>; // track used database fields (table.field format)
  customMappings: EnhancedFieldMapping[]; // user-defined mappings
}

// Validation rules for field compatibility
export interface FieldCompatibilityRule {
  databaseFieldType: string;
  allowedFormFieldTypes: string[];
  restrictions?: {
    maxLength?: number;
    pattern?: string;
    required?: boolean;
  };
}
