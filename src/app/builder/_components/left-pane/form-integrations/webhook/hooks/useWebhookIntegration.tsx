import { useFormIntegrations } from '@/data-fetching/client/formIntegration';

export const useWebhookIntegration = (formId: string, enabled: boolean) => {
  return useFormIntegrations(formId, { provider: 'webhook' }, (d) => d?.[0], enabled);
};
