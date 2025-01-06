'use client';

import { useState } from 'react';

import { Input } from '@/components/ui/input';
import FormCard from './FormCard';
import DeleteFormModal from './DeleteFormModal';

import { useFormsQuery } from '@/data-fetching/client/form';
import useDeleteForm from '../_hooks/useDeleteForm';
import useEditForm from '../_hooks/useEditForm';

const Forms = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: forms } = useFormsQuery();

  const { deleteFormMutation, formIdToDelete, handleFormDelete: handleFormDeleteFn } = useDeleteForm();

  const { handleFormEdit } = useEditForm();

  const handleFormDelete = (id: string) => {
    handleFormDeleteFn(id, () => {
      setIsDeleteModalOpen(true);
    });
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
