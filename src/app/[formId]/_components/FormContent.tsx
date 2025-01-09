'use client';

import React from 'react';
import { FieldValues, useForm, UseFormReturn } from 'react-hook-form';

import FieldRenderer from './fields/FieldRenderer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import type { FormProps } from './Form';
import type { PageEntity } from '@/types/form-config';

interface FormContentProps extends FormProps {
  activePageId: string;
  onActivePageIdChange: (pageId: string) => void;
  onFormSubmit: (data: FieldValues) => void;
  formValuesByPageMap: Record<string, FieldValues>;
}

const FormPageName = ({ name, color }: { name: string; color: string }) => {
  if (!name) return null;
  return (
    <p
      className="pl-2 font-semibold text-[16px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6 mt-1"
      style={{ color }}
    >
      {name}
    </p>
  );
};

const FormContent = ({
  formConfig,
  activePageId,
  formValuesByPageMap,
  onActivePageIdChange,
  onFormSubmit,
}: FormContentProps) => {
  const activePage = formConfig?.pageEntities?.[activePageId] || formConfig?.pageEntities?.[formConfig?.pages?.[0]];

  const form = useForm({
    defaultValues: {
      ...formValuesByPageMap?.[activePageId],
    },
  });

  const handleFormSubmit = (data: FieldValues) => {
    const activePageIndex = formConfig?.pages?.indexOf(activePageId);
    const nextPageId = formConfig?.pages?.[activePageIndex + 1] || formConfig?.pages?.[activePageIndex];
    console.log(data);
    onFormSubmit?.(data);
    onActivePageIdChange?.(nextPageId);
  };

  return (
    <Form {...form}>
      <form
        className="mt-1 flex flex-col gap-3 w-full transition-all duration-200 ease-in-out"
        onSubmit={form.handleSubmit(handleFormSubmit, (errors) => console.log(JSON.stringify(errors, null, 2)))}
      >
        <FormPageName name={activePage?.name} color={formConfig?.theme?.properties?.primaryTextColor} />
        <FormFieldContainer activePage={activePage} formConfig={formConfig} control={form.control} />
        <FormActions activePageId={activePageId} formConfig={formConfig} onActivePageIdChange={onActivePageIdChange} />
      </form>
    </Form>
  );
};

const FormFieldContainer = ({
  activePage,
  formConfig,
  control,
}: {
  activePage: PageEntity;
  formConfig: FormProps['formConfig'];
  control: UseFormReturn['control'];
}) => {
  const pageFields = activePage?.fields;

  const fieldEntities = formConfig?.fieldEntities;

  return (
    <div className="flex flex-wrap w-full overflow-clip gap-3 transition-all duration-200 ease-in-out">
      {pageFields?.map((field) => (
        <FieldRenderer key={field} field={fieldEntities?.[field]} formConfig={formConfig} control={control} />
      ))}
    </div>
  );
};

export const FormActions = ({
  activePageId,
  formConfig,
  onActivePageIdChange,
}: Pick<FormContentProps, 'activePageId' | 'formConfig' | 'onActivePageIdChange'>) => {
  const isFirstPage = activePageId === formConfig?.pages?.[0];
  const isLastPage = activePageId === formConfig?.pages?.[formConfig?.pages?.length - 1];

  const activePageIndex = formConfig?.pages?.indexOf(activePageId);

  const previousPageId = formConfig?.pages?.[activePageIndex - 1] || formConfig?.pages?.[0];

  return (
    <div className="flex justify-between items-center gap-2 my-6 pl-2 pr-4">
      {formConfig?.pages?.length > 1 && (
        <Button
          type="button"
          variant={'secondary'}
          disabled={isFirstPage}
          onClick={() => onActivePageIdChange(previousPageId)}
        >
          Go Back
        </Button>
      )}
      <Button type="submit" variant={'default'}>
        {isLastPage ? 'Submit' : 'Next'}
      </Button>
    </div>
  );
};

export default FormContent;
