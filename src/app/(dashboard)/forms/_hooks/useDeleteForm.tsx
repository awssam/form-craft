import { useDeleteFormMutation } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import React from 'react';
import { toast } from 'sonner';

const useDeleteForm = () => {
  const [formIdToDelete, setFormIdToDelete] = React.useState<string | null>(null);
  const setFormConfig = useFormActionProperty('setFormConfig');

  const deleteFormMutation = useDeleteFormMutation({
    onMutate: () => {
      const toastId = toast.loading('Deleting form...');
      return toastId;
    },
    onSuccess: (_, __, context) => {
      toast.success('Form deleted successfully', {
        style: { background: '#000', color: '#fff' },
      });
      toast.dismiss(context as string);
      setFormIdToDelete(null);
      setFormConfig(null);
    },
  });

  const handleFormDelete = (id: string, callback: () => void) => {
    setFormIdToDelete(id);
    callback?.();
  };

  return {
    deleteFormMutation,
    handleFormDelete,
    formIdToDelete,
  };
};

export default useDeleteForm;
