import { FieldType } from '@/types/form-config';
import FieldRegistry from '../FieldRegistry';
import { ValidationRuleWithComponent } from '../base/FieldTypes';

/**
 * Validation registry for managing field-specific validation rules and components
 */
class ValidationRegistry {
  private static validationRules = new Map<string, ValidationRuleWithComponent>();
  private static fieldValidations = new Map<FieldType, string[]>();
  private static hooks = new Set<() => void>();

  /**
   * Register a validation rule with its component
   */
  static registerValidation(validation: ValidationRuleWithComponent): void {
    this.validationRules.set(validation.key, validation);
    this.notifyHooks();
  }

  /**
   * Register multiple validation rules for a field type
   */
  static registerFieldValidations(fieldType: FieldType, validationKeys: string[]): void {
    this.fieldValidations.set(fieldType, validationKeys);
    this.notifyHooks();
  }

  /**
   * Get validation rules for a specific field type
   */
  static getValidationsForField(fieldType: FieldType): ValidationRuleWithComponent[] {
    // First, try to get from field registry configuration
    const fieldConfig = FieldRegistry.getFieldConfig(fieldType);
    if (fieldConfig?.validationRules) {
      return fieldConfig.validationRules
        .map(rule => this.validationRules.get(rule.key))
        .filter(Boolean) as ValidationRuleWithComponent[];
    }

    // Fallback to explicit registration
    const validationKeys = this.fieldValidations.get(fieldType) || [];
    return validationKeys
      .map(key => this.validationRules.get(key))
      .filter(Boolean) as ValidationRuleWithComponent[];
  }

  /**
   * Get validation rules by category
   */
  static getValidationsByCategory(
    fieldType: FieldType, 
    category: 'basic' | 'advanced' | 'custom'
  ): ValidationRuleWithComponent[] {
    const validations = this.getValidationsForField(fieldType);
    return validations.filter(validation => validation.category === category);
  }

  /**
   * Get all available validation rules
   */
  static getAllValidations(): ValidationRuleWithComponent[] {
    return Array.from(this.validationRules.values());
  }

  /**
   * Get a specific validation rule
   */
  static getValidation(key: string): ValidationRuleWithComponent | undefined {
    return this.validationRules.get(key);
  }

  /**
   * Check if validations have conflicts
   */
  static hasValidationConflicts(validationKeys: string[]): { hasConflicts: boolean; conflicts: string[] } {
    const conflicts: string[] = [];
    
    for (const key of validationKeys) {
      const validation = this.validationRules.get(key);
      if (validation?.conflicts) {
        const conflictingKeys = validation.conflicts.filter(conflictKey => 
          validationKeys.includes(conflictKey)
        );
        conflicts.push(...conflictingKeys);
      }
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts: Array.from(new Set(conflicts))
    };
  }

  /**
   * Get validation dependencies
   */
  static getValidationDependencies(validationKeys: string[]): string[] {
    const dependencies: string[] = [];
    
    for (const key of validationKeys) {
      const validation = this.validationRules.get(key);
      if (validation?.dependencies) {
        dependencies.push(...validation.dependencies);
      }
    }

    return Array.from(new Set(dependencies));
  }

  /**
   * Subscribe to validation registry changes
   */
  static subscribe(callback: () => void): () => void {
    this.hooks.add(callback);
    return () => this.hooks.delete(callback);
  }

  /**
   * Notify all subscribers of changes
   */
  private static notifyHooks(): void {
    this.hooks.forEach(hook => {
      try {
        hook();
      } catch (error) {
        console.error('Error in validation registry hook:', error);
      }
    });
  }

  /**
   * Get validation statistics
   */
  static getStats(): {
    totalValidations: number;
    validationsByCategory: Record<string, number>;
    fieldValidationCounts: Record<FieldType, number>;
  } {
    const validations = Array.from(this.validationRules.values());
    
    const validationsByCategory = validations.reduce((acc, validation) => {
      acc[validation.category] = (acc[validation.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const fieldValidationCounts = {} as Record<string, number>;
    Array.from(this.fieldValidations.keys()).forEach(fieldType => {
      fieldValidationCounts[fieldType] = this.getValidationsForField(fieldType).length;
    });

    return {
      totalValidations: validations.length,
      validationsByCategory,
      fieldValidationCounts,
    };
  }

  /**
   * Clear all registrations (for testing)
   */
  static clear(): void {
    this.validationRules.clear();
    this.fieldValidations.clear();
    this.notifyHooks();
  }
}

export default ValidationRegistry;
