import { cn } from '@/lib/utils';
import type { FormConfig } from '@/types/form-config';
import React from 'react';
import FormContent from './FormContent';

export interface FormProps {
  formConfig: FormConfig;
}

const classes = cn(
  'flex flex-col gap-3 border-yellow-200/10 px-3 py-5 md:px-5 md:py-5 mx-auto my-auto border border-dashed rounded-md w-[95%] md:w-[min(80%,800px)] transition-all duration-200',
);

const FormHeader = ({ formConfig }: FormProps) => {
  return (
    <header className="flex flex-col gap-1">
      <h3 className="font-bold text-xl tracking-tight border-b border-b-transparent cursor-pointer min-w-12 min-h-6">
        {formConfig?.name}
      </h3>
      <p className="font-normal text-[13px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6">
        {formConfig?.description}
      </p>
    </header>
  );
};

const Form = ({ formConfig }: FormProps) => {
  return (
    <section className={classes} style={{ backgroundColor: formConfig?.theme?.properties?.formBackgroundColor }}>
      <FormHeader formConfig={formConfig} />
      <FormContent formConfig={formConfig} activePageId={formConfig?.pages?.[0]} />
    </section>
  );
};

export default Form;
