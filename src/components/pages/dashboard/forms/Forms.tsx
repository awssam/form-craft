'use client';

import { Input } from '@/components/ui/input';
import React from 'react';
import FormCard from './FormCard';
import { useDeleteFormMutation, useFormsQuery } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import DeleteFormModal from './DeleteFormModal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Forms = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [formIdToDelete, setFormIdToDelete] = React.useState<string | null>(null);

  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const { data: forms } = useFormsQuery();

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

  const handleFormDelete = (id: string) => {
    setFormIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleFormEdit = (id: string) => {
    const form = forms?.find((form) => form.id === id);
    if (form) {
      setFormConfig(form);
      router.push('/builder');
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-4 items-center">
          <Input className="md:w-[500px] h-11" placeholder="Quickly find your forms from here." type="search" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 rounded-lg">
          {forms?.map((form) => (
            <FormCard key={form.id} id={form.id} {...form?.meta} onDelete={handleFormDelete} onEdit={handleFormEdit} />
          ))}
        </div>
      </div>
      <DeleteFormModal
        label={'Delete Form'}
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onConfirm={() => deleteFormMutation({ id: formIdToDelete as string })}
        showTrigger={false}
      />
    </>
  );
};

export default Forms;
