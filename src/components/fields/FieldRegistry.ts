import React from 'react';
import { FieldType } from '@/types/form-config';
import { FieldConfiguration, FieldCategory, ValidationRuleWithComponent, BaseFieldProps } from './base/FieldTypes';

/**
 * Field component type definition
 */
export type FieldComponent = React.ComponentType<BaseFieldProps>;

/**
 * Enhanced field configuration with lazy loading support
 */
export interface EnhancedFieldConfiguration extends Omit<FieldConfiguration, 'component'> {
  component: FieldComponent;
  isLazy?: boolean;
  loader?: () => Promise<{ default: FieldComponent }>;
}

/**
 * Field registration options
 */
export interface FieldRegistrationOptions {
  override?: boolean;
  lazy?: boolean;
}

/**
 * Central registry for managing field types and their configurations.
 * This class provides a plugin-like architecture for field components.
 */
class FieldRegistry {
  private static fields = new Map<FieldType, EnhancedFieldConfiguration>();
  private static categories = new Map<string, FieldCategory>();
  private static validationRules = new Map<string, ValidationRuleWithComponent>();
  private static hooks = new Set<() => void>();
  private static initialized = false;

  /**
   * Register a new field type with its configuration
   */
  static register(config: FieldConfiguration): void {
    if (this.fields.has(config.type)) {
      console.warn(`Field type "${config.type}" is already registered. Overwriting...`);
    }
    
    const enhancedConfig: EnhancedFieldConfiguration = {
      ...config,
      isLazy: false,
    };
    
    this.fields.set(config.type, enhancedConfig);
    
    // Auto-register validation rules
    config.validationRules.forEach(rule => {
      this.validationRules.set(rule.key, rule);
    });
    
    this.notifyHooks();
    console.debug(`Registered field type: ${config.type}`);
  }

  /**
   * Register a field with component separately (for enhanced control)
   */
  static registerWithComponent(
    type: FieldType, 
    config: Omit<FieldConfiguration, 'type' | 'component'>, 
    component: FieldComponent,
    options: FieldRegistrationOptions = {}
  ): void {
    const { override = false, lazy = false } = options;

    if (this.fields.has(type) && !override) {
      console.warn(`Field type "${type}" is already registered. Use override option to replace.`);
      return;
    }

    const enhancedConfig: EnhancedFieldConfiguration = {
      ...config,
      type,
      component,
      isLazy: lazy,
    };

    this.fields.set(type, enhancedConfig);
    
    // Auto-register validation rules
    config.validationRules.forEach(rule => {
      this.validationRules.set(rule.key, rule);
    });

    this.notifyHooks();
    console.debug(`Registered field type with component: ${type}`);
  }

  /**
   * Register a lazy-loaded field component
   */
  static registerLazy(
    type: FieldType,
    config: Omit<FieldConfiguration, 'type' | 'component'>,
    loader: () => Promise<{ default: FieldComponent }>,
    options: FieldRegistrationOptions = {}
  ): void {
    const { override = false } = options;

    if (this.fields.has(type) && !override) {
      console.warn(`Field type "${type}" is already registered. Use override option to replace.`);
      return;
    }

    // Create a lazy component wrapper
    const LazyComponent = React.lazy(loader);
    
    const enhancedConfig: EnhancedFieldConfiguration = {
      ...config,
      type,
      component: LazyComponent,
      isLazy: true,
      loader,
    };

    this.fields.set(type, enhancedConfig);
    
    // Auto-register validation rules
    config.validationRules.forEach(rule => {
      this.validationRules.set(rule.key, rule);
    });

    this.notifyHooks();
    console.debug(`Registered lazy field type: ${type}`);
  }

  /**
   * Register multiple field types at once (legacy method)
   */
  static registerManyConfigs(configs: FieldConfiguration[]): void {
    configs.forEach(config => this.register(config));
  }

  /**
   * Get field configuration by type
   */
  static getFieldConfig(type: FieldType): EnhancedFieldConfiguration | undefined {
    return this.fields.get(type);
  }

  /**
   * Get component for a specific field type
   */
  static getFieldComponent(type: FieldType): FieldComponent | undefined {
    const config = this.fields.get(type);
    return config?.component;
  }

  /**
   * Get all registered field configurations
   */
  static getAllFields(): EnhancedFieldConfiguration[] {
    return Array.from(this.fields.values());
  }

  /**
   * Get fields by category
   */
  static getFieldsByCategory(categoryId: string): FieldConfiguration[] {
    return this.getAllFields().filter(field => field.category === categoryId);
  }

  /**
   * Get available field types
   */
  static getAvailableTypes(): FieldType[] {
    return Array.from(this.fields.keys());
  }

  /**
   * Check if a field type is registered
   */
  static isRegistered(type: FieldType): boolean {
    return this.fields.has(type);
  }

  /**
   * Unregister a field type
   */
  static unregister(type: FieldType): boolean {
    return this.fields.delete(type);
  }

  /**
   * Register a field category
   */
  static registerCategory(category: FieldCategory): void {
    this.categories.set(category.id, category);
  }

  /**
   * Get all registered categories
   */
  static getAllCategories(): FieldCategory[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Get category by ID
   */
  static getCategory(id: string): FieldCategory | undefined {
    return this.categories.get(id);
  }

  /**
   * Get validation rule by key
   */
  static getValidationRule(key: string): ValidationRuleWithComponent | undefined {
    return this.validationRules.get(key);
  }

  /**
   * Get all validation rules for a field type
   */
  static getValidationRulesForField(type: FieldType): ValidationRuleWithComponent[] {
    const fieldConfig = this.getFieldConfig(type);
    return fieldConfig?.validationRules || [];
  }

  /**
   * Search fields by name, description, or tags
   */
  static searchFields(query: string): FieldConfiguration[] {
    const lowercaseQuery = query.toLowerCase();
    
    return this.getAllFields().filter(field => 
      field.displayName.toLowerCase().includes(lowercaseQuery) ||
      field.description.toLowerCase().includes(lowercaseQuery) ||
      field.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get field icon as React element
   */
  static getFieldIcon(type: FieldType): React.ReactNode | null {
    const config = this.getFieldConfig(type);
    return config?.icon || null;
  }

  /**
   * Get field display name
   */
  static getFieldDisplayName(type: FieldType): string {
    const config = this.getFieldConfig(type);
    return config?.displayName || type;
  }

  /**
   * Get field description
   */
  static getFieldDescription(type: FieldType): string {
    const config = this.getFieldConfig(type);
    return config?.description || '';
  }

  /**
   * Get default configuration for a field type
   */
  static getDefaultConfig(type: FieldType): Partial<import('@/types/form-config').FieldEntity> {
    const config = this.getFieldConfig(type);
    return config?.defaultConfig || {};
  }

  /**
   * Get customization options for a field type
   */
  static getCustomizationOptions(type: FieldType): import('./base/FieldTypes').CustomizationOption[] {
    const config = this.getFieldConfig(type);
    return config?.customizations || [];
  }

  /**
   * Check if a field type is deprecated
   */
  static isDeprecated(type: FieldType): boolean {
    const config = this.getFieldConfig(type);
    return config?.deprecated || false;
  }

  /**
   * Get statistics about registered fields
   */
  static getStats(): {
    totalFields: number;
    totalCategories: number;
    totalValidationRules: number;
    fieldsByCategory: Record<string, number>;
  } {
    const fieldsByCategory: Record<string, number> = {};
    
    this.getAllFields().forEach(field => {
      fieldsByCategory[field.category] = (fieldsByCategory[field.category] || 0) + 1;
    });

    return {
      totalFields: this.fields.size,
      totalCategories: this.categories.size,
      totalValidationRules: this.validationRules.size,
      fieldsByCategory,
    };
  }

  /**
   * Clear all registered fields (useful for testing)
   */
  static clear(): void {
    this.fields.clear();
    this.categories.clear();
    this.validationRules.clear();
    this.notifyHooks();
  }

  /**
   * Initialize with default field registrations
   */
  static initialize(): void {
    if (this.initialized) return;
    
    // Import and register all specialized field components
    this.initializeDefaultFields();
    
    this.initialized = true;
    this.notifyHooks();
  }

  /**
   * Initialize default field registrations
   */
  private static async initializeDefaultFields(): Promise<void> {
    // Import the field registration system
    try {
      await import('./FieldRegistrations');
      // The registration will happen automatically when the module is imported
      console.log('✅ Default field registrations loaded');
    } catch (error) {
      console.error('❌ Failed to load default field registrations:', error);
    }
  }

  /**
   * Check if registry has been initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Subscribe to registry changes
   */
  static subscribe(callback: () => void): () => void {
    this.hooks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.hooks.delete(callback);
    };
  }

  /**
   * Notify all subscribers of registry changes
   */
  private static notifyHooks(): void {
    this.hooks.forEach(hook => {
      try {
        hook();
      } catch (error) {
        console.error('Error in registry hook:', error);
      }
    });
  }

  /**
   * Bulk register multiple fields
   */
  static registerMany(
    fields: Array<{
      type: FieldType;
      config: Omit<FieldConfiguration, 'type' | 'component'>;
      component: FieldComponent;
      options?: FieldRegistrationOptions;
    }>
  ): void {
    fields.forEach(({ type, config, component, options }) => {
      this.registerWithComponent(type, config, component, options);
    });
  }

  /**
   * Get enhanced statistics about registered fields
   */
  static getEnhancedStats(): {
    totalFields: number;
    totalCategories: number;
    totalValidationRules: number;
    fieldsByCategory: Record<string, number>;
    lazyFields: number;
    eagerFields: number;
  } {
    const fieldsByCategory: Record<string, number> = {};
    let lazyFields = 0;
    let eagerFields = 0;
    
    this.getAllFields().forEach(field => {
      fieldsByCategory[field.category] = (fieldsByCategory[field.category] || 0) + 1;
      
      if (field.isLazy) {
        lazyFields++;
      } else {
        eagerFields++;
      }
    });

    return {
      totalFields: this.fields.size,
      totalCategories: this.categories.size,
      totalValidationRules: this.validationRules.size,
      fieldsByCategory,
      lazyFields,
      eagerFields,
    };
  }

  /**
   * Export field configurations (useful for debugging)
   */
  static export(): {
    fields: Record<string, EnhancedFieldConfiguration>;
    categories: Record<string, FieldCategory>;
  } {
    const fields: Record<string, EnhancedFieldConfiguration> = {};
    const categories: Record<string, FieldCategory> = {};
    
    this.fields.forEach((config, type) => {
      fields[type] = config;
    });
    
    this.categories.forEach((category, id) => {
      categories[id] = category;
    });
    
    return { fields, categories };
  }
}

export default FieldRegistry;
