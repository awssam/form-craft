import { useEffect, useMemo } from 'react';
import { FieldType } from '@/types/form-config';
import ValidationRegistry from './ValidationRegistry';
import { ALL_VALIDATION_RULES } from './ValidationRules';
import { ValidationRuleWithComponent } from '../base/FieldTypes';

/**
 * Hook to initialize validation registry with field type mappings
 */
export function useValidationRegistry() {
  useEffect(() => {
    // Register all validation rules
    ALL_VALIDATION_RULES.forEach(rule => {
      ValidationRegistry.registerValidation(rule);
    });

    // Register field type specific validations
    const fieldValidationMappings: Record<FieldType, string[]> = {
      text: ['required', 'minLength', 'maxLength', 'email', 'phone', 'pattern'],
      email: ['required', 'email', 'minLength', 'maxLength'],
      phone: ['required', 'phone', 'minLength', 'maxLength'],
      number: ['required', 'pattern'],
      textarea: ['required', 'minLength', 'maxLength'],
      dropdown: ['required'],
      radio: ['required'],
      checkbox: ['required'],
      date: ['required'],
      datetime: ['required'],
      file: ['required']
    };

    // Register field validations
    Object.entries(fieldValidationMappings).forEach(([fieldType, validationKeys]) => {
      ValidationRegistry.registerFieldValidations(fieldType as FieldType, validationKeys);
    });
  }, []);

  return {
    getValidationsForField: (fieldType: FieldType) => 
      ValidationRegistry.getValidationsForField(fieldType),
    getAllValidations: () => ValidationRegistry.getAllValidations(),
    getValidationsByCategory: (fieldType: FieldType, category: 'basic' | 'advanced' | 'custom') =>
      ValidationRegistry.getValidationsByCategory(fieldType, category),
    getStats: () => ValidationRegistry.getStats()
  };
}

/**
 * Hook to get validation rules for a specific field type
 */
export function useFieldValidations(fieldType: FieldType): ValidationRuleWithComponent[] {
  return useMemo(() => {
    return ValidationRegistry.getValidationsForField(fieldType);
  }, [fieldType]);
}

/**
 * Hook to get validation statistics
 */
export function useValidationStats() {
  return useMemo(() => {
    return ValidationRegistry.getStats();
  }, []);
}

/**
 * Hook for subscribing to validation registry changes
 */
export function useValidationRegistrySubscription(callback: () => void) {
  useEffect(() => {
    return ValidationRegistry.subscribe(callback);
  }, [callback]);
}
