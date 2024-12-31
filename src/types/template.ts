import { FormConfig } from './form-config';

export interface FormTemplate {
  id: string;
  _id?: string; // MongoDB ID
  meta: {
    name: string;
    description?: string;
    image?: string;
  };
  templateConfig?: FormConfig;
}

export interface FormTemplateCategory {
  id: string;
  name: string;
  templates: FormTemplate[];
}
