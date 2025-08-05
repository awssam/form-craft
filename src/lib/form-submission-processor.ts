import { FormConfig } from '@/types/form-config';
import { FormUsageType, FieldMapping } from '@/types/form-templates';
import { FORM_TYPE_CONFIGS } from '@/config/form-types';

// Define types for submission data
export type SubmissionValue = string | number | boolean | Date | string[] | File[] | null | undefined;
export type SubmissionData = Record<string, SubmissionValue>;
export type MappedData = Record<string, SubmissionValue>;
export type RelatedTableData = Record<string, MappedData>;

export interface ProcessedSubmissionData {
  primaryTable: string;
  mappedData: MappedData;
  relatedTableData: RelatedTableData;
  unmappedData: SubmissionData;
  validationErrors: string[];
}

export interface FormSubmissionProcessor {
  processSubmission(formConfig: FormConfig, submissionData: SubmissionData): ProcessedSubmissionData;
  validateMappedData(mappedData: MappedData, fieldMappings: Record<string, FieldMapping>): string[];
  transformFieldValue(value: SubmissionValue, transform?: string): SubmissionValue | Record<string, string>;
}

export class DefaultFormSubmissionProcessor implements FormSubmissionProcessor {
  
  processSubmission(formConfig: FormConfig, submissionData: SubmissionData): ProcessedSubmissionData {
    const result: ProcessedSubmissionData = {
      primaryTable: formConfig.dbConfig?.primaryTable || 'form_submissions',
      mappedData: {},
      relatedTableData: {},
      unmappedData: {},
      validationErrors: []
    };

    // If no form type or auto mapping disabled, store everything as unmapped
    if (!formConfig.formType || !formConfig.dbConfig?.enableAutoMapping || !formConfig.fieldMappings) {
      result.unmappedData = submissionData;
      return result;
    }

    // Process each submission field
    Object.entries(submissionData).forEach(([fieldName, value]) => {
      const fieldMapping = formConfig.fieldMappings![fieldName];
      
      if (fieldMapping) {
        // Transform value if needed
        const transformedValue = this.transformFieldValue(value, fieldMapping.transform);
        
        // Check if this field maps to the primary table
        if (fieldMapping.targetTable === result.primaryTable) {
          result.mappedData[fieldMapping.targetField] = transformedValue as SubmissionValue;
        } else {
          // This field maps to a related table
          if (!result.relatedTableData[fieldMapping.targetTable]) {
            result.relatedTableData[fieldMapping.targetTable] = {};
          }
          result.relatedTableData[fieldMapping.targetTable][fieldMapping.targetField] = transformedValue as SubmissionValue;
        }
      } else {
        // Field has no mapping, store as unmapped
        result.unmappedData[fieldName] = value;
      }
    });

    // Validate mapped data
    result.validationErrors = this.validateMappedData(result.mappedData, formConfig.fieldMappings);

    return result;
  }

  validateMappedData(mappedData: MappedData, fieldMappings: Record<string, FieldMapping>): string[] {
    const errors: string[] = [];

    // Check required fields
    Object.entries(fieldMappings).forEach(([fieldName, mapping]) => {
      if (mapping.required) {
        const value = mappedData[mapping.targetField];
        if (value === undefined || value === null || value === '') {
          errors.push(`Required field '${fieldName}' is missing or empty`);
        }
      }

      // Basic validation based on validation string
      if (mapping.validation && mappedData[mapping.targetField] !== undefined) {
        const validationErrors = this.validateField(mappedData[mapping.targetField], mapping.validation);
        errors.push(...validationErrors.map(err => `Field '${fieldName}': ${err}`));
      }
    });

    return errors;
  }

  private validateField(value: SubmissionValue, validation: string): string[] {
    const errors: string[] = [];
    const rules = validation.split('|');

    rules.forEach(rule => {
      const [ruleName, ruleValue] = rule.split(':');

      switch (ruleName) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors.push('This field is required');
          }
          break;
        
        case 'email':
          if (value && typeof value === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors.push('Must be a valid email address');
            }
          }
          break;
        
        case 'string':
          if (value && typeof value !== 'string') {
            errors.push('Must be a string');
          }
          break;
        
        case 'max':
          if (value && typeof value === 'string' && ruleValue) {
            const maxLength = parseInt(ruleValue);
            if (value.length > maxLength) {
              errors.push(`Must not exceed ${maxLength} characters`);
            }
          }
          break;
        
        case 'in':
          if (value && ruleValue) {
            const allowedValues = ruleValue.split(',');
            if (!allowedValues.includes(String(value))) {
              errors.push(`Must be one of: ${allowedValues.join(', ')}`);
            }
          }
          break;
        
        case 'array':
          if (value && !Array.isArray(value)) {
            errors.push('Must be an array');
          }
          break;
      }
    });

    return errors;
  }

  transformFieldValue(value: SubmissionValue, transform?: string): SubmissionValue | Record<string, string> {
    if (!transform || value === undefined || value === null) {
      return value;
    }

    switch (transform) {
      case 'json_encode':
        return JSON.stringify(value);
      
      case 'split_name':
        if (typeof value === 'string') {
          const parts = value.trim().split(' ');
          return {
            first_name: parts[0] || '',
            last_name: parts.slice(1).join(' ') || ''
          };
        }
        return value;
      
      case 'file_upload':
        // Handle file upload transformation
        if (value && typeof value === 'object' && 'name' in value) {
          return JSON.stringify({
            filename: (value as File).name,
            size: (value as File).size,
            type: (value as File).type,
            url: null
          });
        }
        return value;
      
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      
      case 'uppercase':
        return typeof value === 'string' ? value.toUpperCase() : value;
      
      case 'trim':
        return typeof value === 'string' ? value.trim() : value;
      
      default:
        return value;
    }
  }
}

// Factory function to create processor
export const createFormSubmissionProcessor = (): FormSubmissionProcessor => {
  return new DefaultFormSubmissionProcessor();
};

// Helper function to get database schema for form type
export const getDatabaseSchemaForFormType = (formType: FormUsageType) => {
  const formTypeConfig = FORM_TYPE_CONFIGS[formType];
  if (!formTypeConfig) return null;

  const schema = {
    primaryTable: getPrimaryTableForFormType(formType),
    relatedTables: getRelatedTablesForFormType(formType),
    fieldMappings: formTypeConfig.fieldMappings,
    requiredFields: formTypeConfig.requiredMappings
  };

  return schema;
};

const getPrimaryTableForFormType = (formType: FormUsageType): string => {
  const tableMap: Record<FormUsageType, string> = {
    'event-registration': 'event_registrations',
    'exhibitor-registration': 'exhibitor_registrations'
  };
  return tableMap[formType] || 'event_registrations';
};

const getRelatedTablesForFormType = (formType: FormUsageType): string[] => {
  const relatedTablesMap: Record<FormUsageType, string[]> = {
    'event-registration': ['events', 'event_sessions'],
    'exhibitor-registration': ['exhibitions', 'exhibition_details']
  };
  return relatedTablesMap[formType] || [];
};

// Utility function to generate SQL-like table creation scripts (for documentation)
export const generateTableSchema = (formType: FormUsageType): string[] => {
  const formTypeConfig = FORM_TYPE_CONFIGS[formType];
  if (!formTypeConfig) return [];

  const schemas: string[] = [];

  // Group field mappings by table
  const tableFields: Record<string, (FieldMapping & { fieldName: string })[]> = {};
  Object.entries(formTypeConfig.fieldMappings).forEach(([fieldName, mapping]) => {
    if (!tableFields[mapping.targetTable]) {
      tableFields[mapping.targetTable] = [];
    }
    tableFields[mapping.targetTable].push({ ...mapping, fieldName });
  });

  // Generate schema for each table
  Object.entries(tableFields).forEach(([tableName, fields]) => {
    let schema = `CREATE TABLE ${tableName} (\n`;
    schema += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
    
    fields.forEach(field => {
      const fieldType = getFieldTypeFromValidation(field.validation);
      const nullable = field.required ? 'NOT NULL' : 'NULL';
      schema += `  ${field.targetField} ${fieldType} ${nullable},\n`;
    });
    
    schema += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    schema += `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n`;
    schema += `);`;
    
    schemas.push(schema);
  });

  return schemas;
};

const getFieldTypeFromValidation = (validation?: string): string => {
  if (!validation) return 'TEXT';
  
  if (validation.includes('email')) return 'VARCHAR(255)';
  if (validation.includes('max:')) {
    const match = validation.match(/max:(\d+)/);
    if (match) {
      const maxLength = parseInt(match[1]);
      return maxLength > 255 ? 'TEXT' : `VARCHAR(${maxLength})`;
    }
  }
  if (validation.includes('array')) return 'JSON';
  if (validation.includes('date')) return 'DATE';
  if (validation.includes('integer')) return 'INT';
  if (validation.includes('decimal')) return 'DECIMAL(10,2)';
  
  return 'VARCHAR(255)';
};
