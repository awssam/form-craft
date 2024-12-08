import SectionDisplay from '@/components/builder/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplay';
import React from 'react';

const FormBuilderPage = () => {
  return (
    <FormSectionDisplayProvider>
      <main className="flex md:flex-row flex-col flex-nowrap bg-background w-[100dvw] h-[100dvh]">
        <SectionDisplay />
      </main>
    </FormSectionDisplayProvider>
  );
};

export default FormBuilderPage;
