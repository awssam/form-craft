import { MutationFunction, useMutation, UseMutationOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { createForm, deleteForm, fetchAllForms, publishForm, updateForm } from '../functions/form';
import { useAuth } from '@clerk/nextjs';
import { FieldEntity, FormConfig, FormConfigWithMeta } from '@/types/form-config';
import { useFormConfigStore } from '@/zustand/store';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { saveFormConfigToLocalStorage } from '@/lib/form';

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
      onSuccess?.(data, void vars, context);
    },
  });

  return mutate;
};

export const useUpdateFormConfigMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<FormConfig> }) => updateForm(id, update),
    onMutate: ({ id, update }) => {
      queryClient.setQueryData(['all-forms', userId], (prev: FormConfigWithMeta[]) => {
        if (prev) {
          return prev.map((form) => {
            if (form.id === id) {
              return {
                ...form,
                ...update,
                meta: {
                  ...form.meta,
                  title: update.name || form.meta.title,
                  description: update.description || form.meta.description,
                  status: update.status || form.meta.status,
                  lastModified: new Date().toISOString(),
                },
              };
            }
            return form;
          });
        }
        return prev;
      });
    },
  });

  return {
    mutateAsync,
    isPending,
    error,
  };
};

export const useAutoSaveFormConfig = () => {
  const { mutateAsync: updateFormMutation, isPending, error } = useUpdateFormConfigMutation();
  const formConfig = useFormConfigStore((s) => s.formConfig);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [hasUserInteractedWithSite, setHasUserInteractedWithSite] = useState(false);

  useEffect(() => {
    if (formConfig?.createdBy === 'SYSTEM' || !hasUserInteractedWithSite) return; // Don't auto save templates

    console.log('update triggered');

    let timerId = timer?.current as NodeJS.Timeout;

    if (timerId) clearTimeout(timerId);

    timer.current = timerId = setTimeout(() => {
      const fieldEntitiesWithoutValidationFns = Object.entries(formConfig?.fieldEntities)?.reduce(
        (acc, [id, field]) => {
          acc[id] = {
            ...field,
            validation: {
              ...field.validation,
              validate: {}, // While saving this should be empty as this doesn't need to be saved in backend. Removing this would cause error passing functions to server actions
            },
          };
          return acc;
        },
        {} as Record<FieldEntity['id'], FieldEntity>,
      );

      const toastId = toast.loading('Saving changes...');
      const updatedFormConfig = { ...formConfig, fieldEntities: fieldEntitiesWithoutValidationFns };

      console.info({
        updatedFormConfig,
      });

      if (formConfig)
        updateFormMutation({
          id: formConfig.id,
          update: updatedFormConfig,
        })
          .then(() => {
            toast.dismiss(toastId);
            saveFormConfigToLocalStorage(updatedFormConfig);
            toast.success('Auto save successful', { style: { background: '#000', color: '#fff' } });
          })
          .catch((error) => {
            console.error(error);
            toast.dismiss(toastId);
            toast.error('Auto save failed', { style: { background: '#000', color: '#fff' } });
          });
    }, 3000);

    return () => clearTimeout(timerId);
  }, [formConfig, updateFormMutation, hasUserInteractedWithSite]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasUserInteractedWithSite(true);
    };
    document.addEventListener('mousedown', handleInteraction);

    return () => {
      document.removeEventListener('mousedown', handleInteraction);
    };
  }, []);

  return {
    isPending,
    error,
  };
};

export const usePublishFormMutation = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async ({ id }: { id: string }) => publishForm(id),
    onMutate: ({ id }) => {
      queryClient.setQueryData(['all-forms', userId], (prev: FormConfigWithMeta[]) => {
        if (prev) {
          return prev.map((form) => {
            if (form.id === id) {
              return {
                ...form,
                meta: {
                  ...form.meta,
                  status: 'published',
                  lastModified: new Date().toISOString(),
                },
                status: 'published',
              };
            }
            return form;
          });
        }
        return prev;
      });
    },
    onSettled: (data, error, vars, context) => {
      if (error) {
        queryClient.setQueryData(['all-forms', userId], context);
      }
    },
  });

  return {
    mutateAsync,
    isPending,
    error,
  };
};
