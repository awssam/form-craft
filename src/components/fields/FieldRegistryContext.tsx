"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FieldType } from '@/types/form-config';
import { FieldConfiguration, FieldCategory, BaseFieldProps } from './base/FieldTypes';

// Enhanced field configuration with React component
export interface EnhancedFieldConfiguration extends Omit<FieldConfiguration, 'component'> {
  component: React.ComponentType<BaseFieldProps>;
}

// Registry state interface
interface FieldRegistryState {
  fields: Map<FieldType, EnhancedFieldConfiguration>;
  categories: Map<string, FieldCategory>;
  initialized: boolean;
}

// Context interface
interface FieldRegistryContextType {
  // State
  fields: Map<FieldType, EnhancedFieldConfiguration>;
  categories: Map<string, FieldCategory>;
  initialized: boolean;
  
  // Actions
  registerField: (type: FieldType, config: Omit<FieldConfiguration, 'type' | 'component'>, component: React.ComponentType<BaseFieldProps>) => void;
  registerCategory: (category: FieldCategory) => void;
  unregisterField: (type: FieldType) => void;
  clearAll: () => void;
  setInitialized: (initialized: boolean) => void;
  
  // Getters (computed)
  getAllFields: () => EnhancedFieldConfiguration[];
  getAllCategories: () => FieldCategory[];
  getFieldsByCategory: (categoryId: string) => EnhancedFieldConfiguration[];
  getFieldConfig: (type: FieldType) => EnhancedFieldConfiguration | undefined;
  getCategory: (id: string) => FieldCategory | undefined;
  isFieldRegistered: (type: FieldType) => boolean;
  getStats: () => {
    totalFields: number;
    totalCategories: number;
    fieldsByCategory: Record<string, number>;
  };
}

// Create context
const FieldRegistryContext = createContext<FieldRegistryContextType | undefined>(undefined);

// Provider component
interface FieldRegistryProviderProps {
  children: ReactNode;
}

export const FieldRegistryProvider: React.FC<FieldRegistryProviderProps> = ({ children }) => {
  const [state, setState] = useState<FieldRegistryState>({
    fields: new Map(),
    categories: new Map(),
    initialized: false,
  });

  // Actions
  const registerField = (type: FieldType, config: Omit<FieldConfiguration, 'type' | 'component'>, component: React.ComponentType<BaseFieldProps>) => {
    setState(prev => {
      const newFields = new Map(prev.fields);
      const enhancedConfig: EnhancedFieldConfiguration = {
        ...config,
        type,
        component,
      };
      newFields.set(type, enhancedConfig);
      
      console.log(`✅ Registered field: ${type}`);
      
      return {
        ...prev,
        fields: newFields,
      };
    });
  };

  const registerCategory = (category: FieldCategory) => {
    setState(prev => {
      const newCategories = new Map(prev.categories);
      newCategories.set(category.id, category);
      
      console.log(`✅ Registered category: ${category.id} - ${category.name}`);
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const unregisterField = (type: FieldType) => {
    setState(prev => {
      const newFields = new Map(prev.fields);
      newFields.delete(type);
      return {
        ...prev,
        fields: newFields,
      };
    });
  };

  const clearAll = () => {
    setState({
      fields: new Map(),
      categories: new Map(),
      initialized: false,
    });
  };

  const setInitialized = (initialized: boolean) => {
    console.log('🔄 Setting initialized to:', initialized);
    setState(prev => {
      console.log('🔄 State update - prev initialized:', prev.initialized, '-> new:', initialized);
      return {
        ...prev,
        initialized,
      };
    });
  };

  // Getters (computed values)
  const getAllFields = (): EnhancedFieldConfiguration[] => {
    return Array.from(state.fields.values());
  };

  const getAllCategories = (): FieldCategory[] => {
    return Array.from(state.categories.values()).sort((a, b) => a.order - b.order);
  };

  const getFieldsByCategory = (categoryId: string): EnhancedFieldConfiguration[] => {
    return getAllFields().filter(field => field.category === categoryId);
  };

  const getFieldConfig = (type: FieldType): EnhancedFieldConfiguration | undefined => {
    return state.fields.get(type);
  };

  const getCategory = (id: string): FieldCategory | undefined => {
    return state.categories.get(id);
  };

  const isFieldRegistered = (type: FieldType): boolean => {
    return state.fields.has(type);
  };

  const getStats = () => {
    const fieldsByCategory: Record<string, number> = {};
    
    getAllFields().forEach(field => {
      fieldsByCategory[field.category] = (fieldsByCategory[field.category] || 0) + 1;
    });

    return {
      totalFields: state.fields.size,
      totalCategories: state.categories.size,
      fieldsByCategory,
    };
  };

  const contextValue: FieldRegistryContextType = {
    // State
    fields: state.fields,
    categories: state.categories,
    initialized: state.initialized,
    
    // Actions
    registerField,
    registerCategory,
    unregisterField,
    clearAll,
    setInitialized,
    
    // Getters
    getAllFields,
    getAllCategories,
    getFieldsByCategory,
    getFieldConfig,
    getCategory,
    isFieldRegistered,
    getStats,
  };

  return (
    <FieldRegistryContext.Provider value={contextValue}>
      {children}
    </FieldRegistryContext.Provider>
  );
};

// Hook to use the context
export const useFieldRegistry = (): FieldRegistryContextType => {
  const context = useContext(FieldRegistryContext);
  if (context === undefined) {
    throw new Error('useFieldRegistry must be used within a FieldRegistryProvider');
  }
  return context;
};

// Hook for easy field registration
export const useFieldRegistration = () => {
  const { registerField, registerCategory, setInitialized } = useFieldRegistry();
  
  return {
    registerField,
    registerCategory,
    setInitialized,
  };
};

// Hook for field data access
export const useFieldData = () => {
  const { 
    getAllFields, 
    getAllCategories, 
    getFieldsByCategory, 
    getFieldConfig, 
    getCategory,
    isFieldRegistered,
    getStats,
    initialized 
  } = useFieldRegistry();
  
  console.log('🔍 useFieldData called - initialized:', initialized, 'categories:', getAllCategories().length, 'fields:', getAllFields().length);
  
  return {
    getAllFields,
    getAllCategories,
    getFieldsByCategory,
    getFieldConfig,
    getCategory,
    isFieldRegistered,
    getStats,
    initialized,
  };
};
