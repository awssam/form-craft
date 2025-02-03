import { createFormSubmission } from '../functions/formSubmission';
import { useMutation } from '@tanstack/react-query';

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
