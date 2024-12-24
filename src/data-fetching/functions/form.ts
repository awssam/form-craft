import { createFormConfigAction, deleteFormAction, getAllUserFormsAction } from '@/backend/actions/form';
import { FormConfig } from '@/types/form-config';

type FormConfigWithMeta = {
  meta: {
    title: string;
    description: string;
    status: string;
    submissions: number;
    lastModified: string;
  };
} & FormConfig;

export const fetchAllForms = async () => {
  const res = await getAllUserFormsAction();

  if (res?.success) return res?.data as FormConfigWithMeta[];

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const createForm = async () => {
  const res = await createFormConfigAction();

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const deleteForm = async (id: string) => {
  const res = await deleteFormAction(id);

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const updateForm = async (id: string) => {};
