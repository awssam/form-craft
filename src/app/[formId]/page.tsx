import { getFormConfigWithIdAction } from '@/backend/actions/form';
import { FormConfig } from '@/types/form-config';
import React from 'react';
import Form from './_components/Form';

const FormPage = async ({ params }: { params: { formId: string } }) => {
  const res = await getFormConfigWithIdAction(params.formId).then((res) => res?.data);

  const formConfig: FormConfig = res || ({} as FormConfig);

  return (
    <main className="w-screen h-screen center-pane bg-background flex flex-col px-4 py-8">
      <Form formConfig={formConfig} />
    </main>
  );
};

export default FormPage;
