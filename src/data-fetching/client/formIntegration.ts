import { useMutation, useQuery } from '@tanstack/react-query';
import { getFormIntegrations, saveFormIntegration } from '../functions/formIntegration';
import { type FormIntegration } from '@/types/integration';

export const useSaveIntegrationMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: FormIntegration, context: unknown) => void;
  onError?: (error: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async (data: FormIntegration) => saveFormIntegration(data),
    retry: false,
    onSuccess: (data, _, context) => {
      onSuccess?.(data as FormIntegration, context);
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useFormIntegrations = (
  formId: string,
  filter?: Record<string, unknown>,
  select?: (data: FormIntegration[]) => unknown,
  enabled?: boolean,
) => {
  return useQuery({
    queryKey: ['form-integrations', { formId, filter }],
    queryFn: () => getFormIntegrations(formId, filter) as Promise<FormIntegration[]>,
    select: (res) => select?.(res as FormIntegration[]) || res,
    enabled,
  });
};
