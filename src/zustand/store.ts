import { FormConfig } from "@/types/form-config";
import { create } from "zustand";
import { formConfig } from "./data";

type State = {
  formConfig: FormConfig;
};

type Action = {
  setFormConfig: (formConfig: FormConfig) => void;
  updateFormConfig: (formConfig: Partial<FormConfig>) => void;
  resetFormConfig: () => void;
  updateFormStyles: (styles: Partial<FormConfig["styles"]>) => void;
};

export const useFormConfigStore = create<State & Action>((set) => ({
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
  
  resetFormConfig: () => set({ formConfig: {} as FormConfig }),
}));



/**
 * A hook to get top level properties from the form config. If the key is not present in the config, returns null.
 * @param key The key of the top level property to get. Must be a valid key in the FormConfig type.
 * @returns The value of the property if it exists, null otherwise.
 */
export const useFormProperty = <K extends keyof FormConfig> (key:K) : FormConfig[K] | null => {
  return useFormConfigStore((state) => state.formConfig[key] ?? null);
};


/**
 * A hook to get an action from the store. This is useful to get action methods that are used in the form config.
 * @param key The key of the action to get. Must be a valid key in the State type.
 * @returns The value of the action if it exists, null otherwise.
 */
export const useFormActionProperty = <T extends keyof Action>(
  key: T
): Action[T] => {
  return useFormConfigStore((state) => state?.[key]);
};