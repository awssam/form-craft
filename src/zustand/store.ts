import { FieldEntity, FormConfig } from '@/types/form-config';
import { create } from 'zustand';
import { formConfig } from './data';

type FormState = {
  formConfig: FormConfig;
};

type FormAction = {
  setFormConfig: (formConfig: FormConfig) => void;
  updateFormConfig: (formConfig: Partial<FormConfig>) => void;
  resetFormConfig: () => void;
  updateFormStyles: (styles: Partial<FormConfig['styles']>) => void;
  updateFormTheme: (theme: Partial<FormConfig['theme']>) => void;
  setPageFields: (pageId: string, fields: string[]) => void;
  updateFormField: (fieldId: string, update: Partial<FieldEntity>) => void;
};

export const useFormConfigStore = create<FormState & FormAction>((set) => ({
  formConfig,
  setFormConfig: (formConfig) => set({ formConfig }),
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
  setPageFields: (pageId: string, fields: string[]) =>
    set((state) => {
      return {
        formConfig: {
          ...state?.formConfig,
          pageEntities: {
            ...state.formConfig?.pageEntities,
            [pageId]: {
              ...state.formConfig?.pageEntities?.[pageId],
              fields,
            },
          },
        },
      };
    }),

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
}));

/**
 * A hook to get top level properties from the form config. If the key is not present in the config, returns null.
 * @param key The key of the top level property to get. Must be a valid key in the FormConfig type.
 * @returns The value of the property if it exists, null otherwise.
 */
export const useFormProperty = <K extends keyof FormConfig>(key: K): FormConfig[K] | null => {
  return useFormConfigStore((state) => state.formConfig[key] ?? null);
};

/**
 * A hook to get an action from the store. This is useful to get action methods that are used in the form config.
 * @param key The key of the action to get. Must be a valid key in the State type.
 * @returns The value of the action if it exists, null otherwise.
 */
export const useFormActionProperty = <T extends keyof FormAction>(key: T): FormAction[T] => {
  return useFormConfigStore((state) => state?.[key]);
};

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
    const id = get().selectedField?.id;
    if (!id) return;

    set((s) => ({
      ...s,
      selectedField: { ...s.selectedField, ...update } as FieldEntity,
    }));
    !onlyUpdateSelectedField && useFormConfigStore?.getState()?.updateFormField(id!, update!);
  },
}));

type FieldVisibilityState = {
  fields: Record<string, boolean>;
};
type FieldVisibilityAction = {
  setFieldVisibility: (fieldId: string, visible: boolean) => void;
};

export const useFieldVisibilityStore = create<FieldVisibilityState & FieldVisibilityAction>((set, get) => ({
  fields: {},
  setFieldVisibility: (fieldId, visible) => set({ fields: { ...get().fields, [fieldId]: visible } }),
}));

type UIState = {
  isDraggingFormField: boolean;
};

type UIAction = {
  setIsDraggingFormField: (isDragging: boolean) => void;
};

export const useUIEventsStore = create<UIState & UIAction>((set) => ({
  isDraggingFormField: false,
  setIsDraggingFormField: (isDragging) => set({ isDraggingFormField: isDragging }),
}));

export const useUIEventsProperty = <T extends keyof UIState>(key: T): UIState[T] => {
  return useUIEventsStore((state) => state[key]);
};

export const useUIEventsActionProperty = <T extends keyof UIAction>(key: T): UIAction[T] => {
  return useUIEventsStore((state) => state[key]);
};
