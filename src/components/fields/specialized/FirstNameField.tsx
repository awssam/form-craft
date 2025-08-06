import React, { useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { FieldEntity } from '@/types/form-config';
import TextField from './TextField';
import { cn } from '@/lib/utils';

/**
 * FirstNameField - A specialized wrapper around TextField with first name specific validations
 * Demonstrates the migration pattern for simple text fields with custom constraints
 */
export interface FirstNameFieldProps extends BaseFieldProps {
  /** Minimum length for first name (default: 2) */
  minLength?: number;
  
  /** Maximum length for first name (default: 50) */
  maxLength?: number;
  
  /** Whether to allow special characters like hyphens and apostrophes */
  allowSpecialChars?: boolean;
}

const FirstNameField: React.FC<FirstNameFieldProps> = ({
  config,
  minLength = 2,
  maxLength = 50,
  allowSpecialChars = true,
  className,
  ...props
}) => {
  // Create enhanced config specifically for first name fields
  const enhancedConfig = useMemo((): FieldEntity => {
    const baseConfig = { ...config };
    
    // Force text type and add first name specific properties
    baseConfig.type = 'text';
    baseConfig.placeholder = baseConfig.placeholder || 'Enter your first name';
    
    // Enhance validation with first name specific rules
    const customValidation = { ...baseConfig.validation?.custom };
    
    // Add length validation
    customValidation.minLength = {
      value: minLength,
      message: `First name must be at least ${minLength} characters`,
      type: 'withValue' as const,
    };
    
    customValidation.maxLength = {
      value: maxLength,
      message: `First name cannot exceed ${maxLength} characters`,
      type: 'withValue' as const,
    };
    
    // Add pattern validation for allowed characters
    const patternRegex = allowSpecialChars 
      ? /^[a-zA-Z\s'-]+$/ 
      : /^[a-zA-Z\s]+$/;
    
    const patternMessage = allowSpecialChars
      ? 'First name can only contain letters, spaces, hyphens, and apostrophes'
      : 'First name can only contain letters and spaces';
    
    customValidation.namePattern = {
      value: patternRegex,
      message: patternMessage,
      type: 'withValue' as const,
    };
    
    // Apply enhanced validation
    baseConfig.validation = {
      ...baseConfig.validation,
      custom: customValidation,
    };
    
    return baseConfig;
  }, [config, minLength, maxLength, allowSpecialChars]);

  return (
    <div className={cn('first-name-field-wrapper', className)}>
      {/* Use TextField as the core component - maintains all existing functionality */}
      <TextField
        {...props}
        config={enhancedConfig}
        variant="text"
        inputProps={{
          autoComplete: 'given-name',
          spellCheck: false,
          // Add visual feedback for name fields
          className: 'capitalize',
        }}
      />
    </div>
  );
};

export default FirstNameField;
