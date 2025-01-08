'use client';

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

import FieldRenderer from './fields/FieldRenderer';

import type { FormProps } from './Form';
import type { PageEntity } from '@/types/form-config';
import { Form } from '@/components/ui/form';

interface FormContentProps extends FormProps {
  activePageId: string;
}

const FormPageName = ({ name, color }: { name: string; color: string }) => {
  return (
    <p
      className="font-semibold text-[16px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6 mt-1"
      style={{ color }}
    >
      {name}
    </p>
  );
};

const FormContent = ({ formConfig, activePageId }: FormContentProps) => {
  const activePage = formConfig?.pageEntities?.[activePageId] || formConfig?.pageEntities?.[formConfig?.pages?.[0]];

  const form = useForm({});

  return (
    <Form {...form}>
      <form className="mt-1 flex flex-col gap-3 w-full transition-all duration-200 ease-in-out">
        <FormPageName name={activePage?.name} color={formConfig?.theme?.properties?.primaryTextColor} />
        <FormFieldContainer activePage={activePage} formConfig={formConfig} control={form.control} />
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
    <div className="flex flex-wrap w-full overflow-clip gap-2 transition-all duration-200 ease-in-out">
      {pageFields?.map((field) => (
        <FieldRenderer key={field} field={fieldEntities?.[field]} formConfig={formConfig} control={control} />
      ))}
    </div>
  );
};

export default FormContent;
