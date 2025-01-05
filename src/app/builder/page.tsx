import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/components/pages/builder/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplay';
import React from 'react';

const FormBuilderPage = () => {
  return (
    <FormSectionDisplayProvider>
      <>
        <TopHeader />
        <SectionDisplay />
      </>
    </FormSectionDisplayProvider>
  );
};

export default FormBuilderPage;
