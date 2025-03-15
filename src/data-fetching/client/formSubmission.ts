import { createFormSubmission, getFormSubmissions } from '../functions/formSubmission';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateFormSubmissionMutation = ({
  onMutate,
  onSuccess,
  onError,
}: {
  onMutate?: () => string;
  onSuccess?: (data: Record<string, unknown>, context: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createFormSubmission,
    onMutate,
    onSuccess: (data, _, context) => {
      onSuccess?.(data, context);
    },
    onError,
  });

  return {
    mutateAsync,
    isPending,
  };
};

export const useGetFormSubmissionQuery = (formId: string) => {
  return useQuery({
    queryKey: ['form-submissions', formId],
    queryFn: () => getFormSubmissions(formId, { status: 'completed' }),
    staleTime: 10 * 1000,
  });
};
