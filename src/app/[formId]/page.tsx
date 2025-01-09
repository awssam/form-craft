import { getFormConfigWithIdAction } from '@/backend/actions/form';
import { FormConfig } from '@/types/form-config';
import React from 'react';
import Form from './_components/Form';

const FormPage = async ({ params }: { params: { formId: string } }) => {
  const res = await getFormConfigWithIdAction(params.formId).then((res) => res?.data);

  const formConfig: FormConfig = res || ({} as FormConfig);

  return (
    <main
      className="w-full h-full min-h-screen background-dots bg-opacity-75 flex flex-col px-4 py-8"
      style={{ backgroundColor: formConfig?.theme?.properties?.formBackgroundColor }}
    >
      <Form formConfig={formConfig} />
    </main>
  );
};

export default FormPage;
