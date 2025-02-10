import { useMutation } from '@tanstack/react-query';

import { createNewActivity } from '../functions/activity';

import type { ActivityModelType } from '@/backend/models/activity';

export const useCreateActivityMutation = ({
  onMutate,
  onSuccess,
  onError,
}: {
  onMutate?: () => string;
  onSuccess?: (data: ActivityModelType | undefined, context: string) => void;
  onError?: (error: unknown) => void;
}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNewActivity,
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
