import { MutationFunction, useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { createForm, deleteForm, fetchAllForms } from '../functions/form';
import { useAuth } from '@clerk/nextjs';
import { FormConfig } from '@/types/form-config';

export const useFormsQuery = () => {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['all-forms', userId],
    queryFn: fetchAllForms,
    staleTime: 10 * 1000,
  });
};

export const useCreateFormMutation = ({
  onMutate,
  onSuccess,
  onError,
}: {
  onMutate?: () => string;
  onSuccess: (data: FormConfig, context: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: createForm as MutationFunction<FormConfig>,
    onMutate,
    onSuccess: (data, _, context) => {
      onSuccess(data, context);
      queryClient.invalidateQueries({ queryKey: ['all-forms', userId] });
    },
    onError,
  });

  return mutate;
};

export const useDeleteFormMutation = ({
  onMutate,
  onSuccess,
}: {
  onMutate?: UseMutationOptions['onMutate'];
  onSuccess?: UseMutationOptions['onSuccess'];
}) => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { mutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteForm(id),
    onMutate: ({ id }) => {
      onMutate?.();
      queryClient.setQueryData(['all-forms', userId], (prev: FormConfig[]) => {
        if (prev) {
          return prev.filter((form) => form.id !== id);
        }
        return prev;
      });
    },
    onSuccess: (data, vars, context) => {
      onSuccess?.(data, vars as any, context);
    },
  });

  return mutate;
};
