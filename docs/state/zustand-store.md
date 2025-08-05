# Zustand Store

## 🏪 Store Architecture Overview

FormCraft uses Zustand for state management, providing a lightweight, TypeScript-first solution for managing form configuration, UI state, and field selections. The store is organized into multiple specialized stores for different concerns.

**Location**: `src/zustand/store.ts`

## 📊 Main Form Configuration Store

### FormState Interface

```typescript
interface FormState {
  formConfig: FormConfig;
}

interface FormAction {
  setFormConfig: (formConfig: FormConfig) => void;
  updateFormConfig: (config: Partial<FormConfig>) => void;
  updateFormStyles: (styles: Partial<FormStyles>) => void;
  updateFormTheme: (theme: Partial<FormTheme>) => void;
  resetFormConfig: () => void;
  setPageFields: (pageId: string, fields: string[]) => void;
  updateFormField: (fieldId: string, update: Partial<FieldEntity>) => void;
  addField: (pageId: string, field: FieldEntity) => void;
  duplicateField: (fieldId: string) => void;
  deleteField: (fieldId: string) => void;
  deletePage: (pageId: string) => void;
  addPage: () => void;
  updatePageName: (pageId: string, name: string) => void;
  batchUpdateFields: (fields: Record<FieldEntity['id'], Partial<FieldEntity>>) => void;
}
```

### Store Implementation

```typescript
export const useFormConfigStore = create<FormState & FormAction>((set, get) => ({
  // Initial state
  formConfig: loadFormConfigFromLocalStorage() || defaultFormConfig,
  
  // Basic configuration updates
  setFormConfig: (formConfig) => 
    set({ formConfig: formConfig || ({} as FormConfig) }),
    
  updateFormConfig: (config) => {
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        ...config,
      },
    }));
  },
  
  updateFormStyles: (styles) => {
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        styles: {
          ...state.formConfig.styles,
          ...styles,
        },
      },
    }));
  },
  
  updateFormTheme: (theme) => {
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        theme: {
          ...state.formConfig.theme,
          ...theme,
        },
      },
    }));
  },
  
  resetFormConfig: () => set({ formConfig: {} as FormConfig }),
  
  // Field management
  updateFormField: (fieldId, update) =>
    set((state) => {
      return {
        formConfig: {
          ...state.formConfig,
          fieldEntities: {
            ...state.formConfig.fieldEntities,
            [fieldId]: {
              ...state.formConfig.fieldEntities?.[fieldId],
              ...update,
            },
          },
        },
      };
    }),
    
  addField: (pageId, field) =>
    set((state) => {
      return {
        formConfig: {
          ...state.formConfig,
          pageEntities: {
            ...state.formConfig.pageEntities,
            [pageId]: {
              ...state.formConfig.pageEntities?.[pageId],
              fields: [...state.formConfig.pageEntities?.[pageId].fields, field.id],
            },
          },
          fieldEntities: {
            ...state.formConfig.fieldEntities,
            [field.id]: field,
          },
        },
      };
    }),
    
  duplicateField: (fieldId) =>
    set((state) => {
      const pageId = Object.values(state.formConfig?.pageEntities)
        ?.find((p) => p.fields?.includes(fieldId))?.id;
      if (!pageId) return state;

      const newFieldId = generateId();
      const fields = state.formConfig.pageEntities?.[pageId]?.fields;

      if (fields?.includes(fieldId)) {
        fields.splice(fields.indexOf(fieldId) + 1, 0, newFieldId);
      }

      return {
        formConfig: {
          ...state.formConfig,
          pageEntities: {
            ...state.formConfig.pageEntities,
            [pageId]: {
              ...state.formConfig.pageEntities?.[pageId],
              fields,
            },
          },
          fieldEntities: {
            ...state.formConfig.fieldEntities,
            [newFieldId]: {
              ...state.formConfig.fieldEntities?.[fieldId],
              id: newFieldId,
              name: generateId(),
              label: `Copy of ${state.formConfig.fieldEntities?.[fieldId].label}`,
            },
          },
        },
      };
    }),
    
  deleteField: (fieldId) =>
    set((state) => {
      const pageId = Object.values(state.formConfig?.pageEntities)
        ?.find((p) => p.fields?.includes(fieldId))?.id;
      if (!pageId) return state;

      const fields = state.formConfig.pageEntities?.[pageId]?.fields;
      const fieldEntities = state.formConfig.fieldEntities;

      delete fieldEntities[fieldId];

      if (fields?.includes(fieldId)) {
        fields.splice(fields.indexOf(fieldId), 1);
      }

      useSelectedFieldStore?.getState()?.setSelectedField(null);

      return {
        formConfig: {
          ...state.formConfig,
          pageEntities: {
            ...state.formConfig.pageEntities,
            [pageId]: {
              ...state.formConfig.pageEntities?.[pageId],
              fields,
            },
          },
          fieldEntities,
        },
      };
    }),
    
  // Page management
  addPage: () => {
    set((state) => {
      const pageId = generateId();
      const field = createNewFormField({
        type: 'text' as FieldType,
        name: generateId(),
        label: 'Text field',
      });

      return {
        formConfig: {
          ...state.formConfig,
          pages: [...state.formConfig.pages, pageId],
          pageEntities: {
            ...state.formConfig.pageEntities,
            [pageId]: {
              id: pageId,
              name: `Page ${state.formConfig.pages?.length + 1}`,
              fields: [field.id],
            },
          },
          fieldEntities: {
            ...state.formConfig?.fieldEntities,
            [field.id]: field,
          },
        },
      };
    });
  },
  
  deletePage: (pageId) => {
    set((state) => {
      const pages = state.formConfig.pages.filter((id) => id !== pageId);
      const pageEntities = { ...state.formConfig.pageEntities };
      const fieldEntities = { ...state.formConfig.fieldEntities };
      
      // Remove fields from deleted page
      const fieldsToDelete = pageEntities[pageId]?.fields || [];
      fieldsToDelete.forEach((fieldId) => {
        delete fieldEntities[fieldId];
      });
      
      delete pageEntities[pageId];
      
      return {
        formConfig: {
          ...state.formConfig,
          pages,
          pageEntities,
          fieldEntities,
        },
      };
    });
  },
  
  updatePageName: (pageId: string, name: string) => {
    set((state) => ({
      formConfig: {
        ...state.formConfig,
        pageEntities: {
          ...state.formConfig.pageEntities,
          [pageId]: {
            ...state.formConfig.pageEntities[pageId],
            name,
          },
        },
      },
    }));
  },
  
  batchUpdateFields: (fields: Record<FieldEntity['id'], Partial<FieldEntity>>) => {
    set((state) => {
      const updatedFieldEntities = { ...state.formConfig.fieldEntities };
      
      Object.entries(fields).forEach(([fieldId, update]) => {
        if (updatedFieldEntities[fieldId]) {
          updatedFieldEntities[fieldId] = {
            ...updatedFieldEntities[fieldId],
            ...update,
          };
        }
      });
      
      return {
        formConfig: {
          ...state.formConfig,
          fieldEntities: updatedFieldEntities,
        },
      };
    });
  },
}));
```

## 🎯 Store Helper Hooks

### Form Property Hook

```typescript
/**
 * A hook to get top level properties from the form config.
 * @param key The key of the top level property to get
 * @returns The value of the property if it exists, null otherwise
 */
export const useFormProperty = <K extends keyof FormConfig>(key: K): FormConfig[K] | null => {
  return useFormConfigStore((state) => state?.formConfig?.[key] ?? null);
};
```

### Form Action Hook

```typescript
/**
 * A hook to get an action from the store.
 * @param key The key of the action to get
 * @returns The action method
 */
export const useFormActionProperty = <T extends keyof FormAction>(key: T): FormAction[T] => {
  return useFormConfigStore((state) => state?.[key]);
};
```

## 🎨 Selected Field Store

Manages which field is currently selected in the form builder.

```typescript
type SelectedFieldState = {
  selectedField: FieldEntity | null;
};

type SelectedFieldAction = {
  setSelectedField: (selectedField: FieldEntity | null) => void;
  updateSelectedField: (update: Partial<FieldEntity> | null, onlyUpdateSelectedField?: boolean) => void;
};

export const useSelectedFieldStore = create<SelectedFieldState & SelectedFieldAction>((set, get) => ({
  selectedField: null,
  
  setSelectedField: (selectedField) => set({ selectedField }),
  
  updateSelectedField: (update, onlyUpdateSelectedField = false) => {
    const { selectedField } = get();
    if (!selectedField || !update) return;

    const updatedField = { ...selectedField, ...update };
    set({ selectedField: updatedField });

    // Also update the main form store unless specified otherwise
    if (!onlyUpdateSelectedField) {
      useFormConfigStore.getState().updateFormField(selectedField.id, update);
    }
  },
}));
```

## 👁️ Field Visibility Store

Manages conditional logic field visibility state.

```typescript
type FieldVisibilityState = {
  fields: Record<string, boolean>;
};

type FieldVisibilityAction = {
  setFieldVisibility: (fieldId: string, isVisible: boolean) => void;
  setMultipleFieldVisibility: (visibilityMap: Record<string, boolean>) => void;
  resetFieldVisibility: () => void;
};

export const useFieldVisibilityStore = create<FieldVisibilityState & FieldVisibilityAction>((set) => ({
  fields: {},
  
  setFieldVisibility: (fieldId, isVisible) =>
    set((state) => ({
      fields: {
        ...state.fields,
        [fieldId]: isVisible,
      },
    })),
    
  setMultipleFieldVisibility: (visibilityMap) =>
    set((state) => ({
      fields: {
        ...state.fields,
        ...visibilityMap,
      },
    })),
    
  resetFieldVisibility: () => set({ fields: {} }),
}));
```

## 🖥️ UI Events Store

Manages UI-specific state for drag-and-drop and other interactions.

```typescript
type UIEventsState = {
  isDraggingFormField: boolean;
  isDraggingFieldFromPanel: boolean;
  activeDragFieldId: string | null;
};

type UIEventsAction = {
  setIsDraggingFormField: (isDragging: boolean) => void;
  setIsDraggingFieldFromPanel: (isDragging: boolean) => void;
  setActiveDragFieldId: (fieldId: string | null) => void;
  resetUIEvents: () => void;
};

export const useUIEventsStore = create<UIEventsState & UIEventsAction>((set) => ({
  isDraggingFormField: false,
  isDraggingFieldFromPanel: false,
  activeDragFieldId: null,
  
  setIsDraggingFormField: (isDragging) => set({ isDraggingFormField: isDragging }),
  setIsDraggingFieldFromPanel: (isDragging) => set({ isDraggingFieldFromPanel: isDragging }),
  setActiveDragFieldId: (fieldId) => set({ activeDragFieldId: fieldId }),
  resetUIEvents: () => set({
    isDraggingFormField: false,
    isDraggingFieldFromPanel: false,
    activeDragFieldId: null,
  }),
}));

// Helper hooks for UI events
export const useUIEventsProperty = <K extends keyof UIEventsState>(key: K): UIEventsState[K] => {
  return useUIEventsStore((state) => state[key]);
};

export const useUIEventsAction = <K extends keyof UIEventsAction>(key: K): UIEventsAction[K] => {
  return useUIEventsStore((state) => state[key]);
};
```

## 💾 Persistence Layer

### Local Storage Integration

```typescript
const FORM_CONFIG_STORAGE_KEY = 'formcraft-form-config';
const STORAGE_VERSION = '1.0.0';

interface StorageData {
  version: string;
  formConfig: FormConfig;
  timestamp: number;
}

const saveFormConfigToLocalStorage = (formConfig: FormConfig) => {
  try {
    const storageData: StorageData = {
      version: STORAGE_VERSION,
      formConfig,
      timestamp: Date.now(),
    };
    localStorage.setItem(FORM_CONFIG_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.warn('Failed to save form config to localStorage:', error);
  }
};

const loadFormConfigFromLocalStorage = (): FormConfig | null => {
  try {
    const stored = localStorage.getItem(FORM_CONFIG_STORAGE_KEY);
    if (!stored) return null;
    
    const storageData: StorageData = JSON.parse(stored);
    
    // Version check for backward compatibility
    if (storageData.version !== STORAGE_VERSION) {
      localStorage.removeItem(FORM_CONFIG_STORAGE_KEY);
      return null;
    }
    
    return storageData.formConfig;
  } catch (error) {
    console.warn('Failed to load form config from localStorage:', error);
    return null;
  }
};

// Auto-save form config changes
useFormConfigStore.subscribe(
  (state) => state.formConfig,
  (formConfig) => {
    if (formConfig?.id) {
      saveFormConfigToLocalStorage(formConfig);
    }
  }
);
```

## 🔄 Store Middleware

### Development Tools Integration

```typescript
import { devtools } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

export const useFormConfigStore = create<FormState & FormAction>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Store implementation...
    })),
    {
      name: 'form-config-store',
      serialize: {
        options: {
          undefined: true,
          function: true,
        },
      },
    }
  )
);
```

### Immer Integration for Complex Updates

```typescript
import { immer } from 'zustand/middleware/immer';

export const useFormConfigStore = create<FormState & FormAction>()(
  immer((set, get) => ({
    formConfig: defaultFormConfig,
    
    updateFormField: (fieldId, update) =>
      set((state) => {
        if (state.formConfig.fieldEntities[fieldId]) {
          Object.assign(state.formConfig.fieldEntities[fieldId], update);
        }
      }),
      
    addField: (pageId, field) =>
      set((state) => {
        state.formConfig.pageEntities[pageId].fields.push(field.id);
        state.formConfig.fieldEntities[field.id] = field;
      }),
  }))
);
```

## 📊 Store Performance Optimizations

### Selective Subscriptions

```typescript
// Only subscribe to specific parts of the store
const formName = useFormConfigStore((state) => state.formConfig.name);
const fieldEntities = useFormConfigStore((state) => state.formConfig.fieldEntities);

// Use shallow comparison for objects
import { shallow } from 'zustand/shallow';

const { addField, deleteField } = useFormConfigStore(
  (state) => ({
    addField: state.addField,
    deleteField: state.deleteField,
  }),
  shallow
);
```

### Computed Values

```typescript
// Create computed selectors for derived state
const useFormStats = () => {
  return useFormConfigStore((state) => {
    const totalFields = Object.keys(state.formConfig.fieldEntities || {}).length;
    const totalPages = state.formConfig.pages?.length || 0;
    const requiredFields = Object.values(state.formConfig.fieldEntities || {})
      .filter((field) => field.validation?.custom?.required?.value).length;
      
    return { totalFields, totalPages, requiredFields };
  });
};
```

### Batch Updates

```typescript
// Batch multiple store updates to prevent unnecessary re-renders
const batchUpdateForm = (updates: {
  config?: Partial<FormConfig>;
  fields?: Record<string, Partial<FieldEntity>>;
  pages?: string[];
}) => {
  useFormConfigStore.setState((state) => {
    const newState = { ...state };
    
    if (updates.config) {
      newState.formConfig = { ...newState.formConfig, ...updates.config };
    }
    
    if (updates.fields) {
      Object.entries(updates.fields).forEach(([fieldId, fieldUpdate]) => {
        if (newState.formConfig.fieldEntities[fieldId]) {
          newState.formConfig.fieldEntities[fieldId] = {
            ...newState.formConfig.fieldEntities[fieldId],
            ...fieldUpdate,
          };
        }
      });
    }
    
    return newState;
  });
};
```

This Zustand store architecture provides a clean, performant, and maintainable state management solution for FormCraft's complex form builder requirements.
