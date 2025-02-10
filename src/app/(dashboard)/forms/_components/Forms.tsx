'use client';

import { Fragment, useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import FormCard from './FormCard';
import DeleteFormModal from './DeleteFormModal';

import { useFormsQuery } from '@/data-fetching/client/form';
import useDeleteForm from '../_hooks/useDeleteForm';
import useEditForm from '../_hooks/useEditForm';
import { Combobox, Option } from '@/components/ui/combobox';

const filterOptions = [
  {
    label: 'Published',
    value: 'published',
  },
  {
    label: 'Draft',
    value: 'draft',
  },
];

const Forms = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Option | null>(null);
  const { data: forms } = useFormsQuery();

  const { deleteFormMutation, formIdToDelete, handleFormDelete: handleFormDeleteFn } = useDeleteForm();

  const { handleFormEdit } = useEditForm();

  const handleFormDelete = (id: string) => {
    handleFormDeleteFn(id, () => {
      setIsDeleteModalOpen(true);
    });
  };

  const filteredForms = useMemo(
    () =>
      forms?.filter(
        (f) =>
          f?.status?.includes((selectedStatus?.value as string) || '') &&
          f?.name?.toLowerCase()?.includes(query?.toLowerCase()),
      ),
    [forms, query, selectedStatus?.value],
  );

  return (
    <Fragment>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="md:w-[500px] h-11"
            placeholder="Quickly find your forms from here."
            type="search"
          />
          <Combobox
            triggerStyle={{ width: 150 }}
            placeholder="Filter by status"
            options={filterOptions}
            selectedValues={[selectedStatus as Option]}
            allowMultiple={false}
            handleChange={(v) => setSelectedStatus(v?.[0])}
          />
        </header>
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 rounded-lg">
          {filteredForms?.map((form) => (
            <FormCard key={form.id} id={form.id} {...form?.meta} onDelete={handleFormDelete} onEdit={handleFormEdit} />
          ))}

          {filteredForms?.length === 0 && (
            <div className="col-span-full flex flex-col gap-2 mt-12 justify-center items-center text-muted-foreground">
              <h4 className="text-xl font-bold">No forms found</h4>
              <p className="text-sm">
                You can create a new form from the <span className="text-yellow-200 font-bold">Create a New form</span>{' '}
                button.
              </p>
            </div>
          )}
        </section>
      </div>
      <DeleteFormModal
        label={'Delete Form'}
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onConfirm={() => deleteFormMutation({ id: formIdToDelete as string })}
        showTrigger={false}
      />
    </Fragment>
  );
};

export default Forms;
