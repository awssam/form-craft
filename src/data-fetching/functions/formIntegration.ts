import {
  saveFormIntegration as saveFormIntegrationAction,
  getFormIntegrations as getFormIntegrationsAction,
} from '@/backend/actions/formIntegration';
import { FormIntegration } from '@/types/integration';

export const saveFormIntegration = async (data: FormIntegration) => {
  const res = await saveFormIntegrationAction(data);
  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};

export const getFormIntegrations = async (formId: string, filter?: Record<string, unknown>) => {
  const res = await getFormIntegrationsAction(formId, filter);

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};
