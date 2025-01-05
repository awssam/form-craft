import {
  createFormConfigAction,
  deleteFormAction,
  getAllUserFormsAction,
  publishFormAction,
  updateFormConfigAction,
} from '@/backend/actions/form';
import { FormConfig, FormConfigWithMeta } from '@/types/form-config';

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

export const updateForm = async (id: string, update: Partial<FormConfig>) => {
  const res = await updateFormConfigAction(id, update);

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const publishForm = async (id: string) => {
  const res = await publishFormAction(id);

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};
