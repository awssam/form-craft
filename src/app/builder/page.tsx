'use client';

import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/app/builder/_components/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplay';

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
