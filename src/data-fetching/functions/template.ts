import { getAllTemplatesAction } from '@/backend/actions/template';

export const fetchAllTemplates = async () => {
  const res = await getAllTemplatesAction();

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};
