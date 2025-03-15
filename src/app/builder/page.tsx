'use client';

import TopHeader from '@/components/common/TopHeader';
import SectionDisplay from '@/app/builder/_components/SectionDisplay';
import { FormSectionDisplayProvider } from '@/hooks/useFormSectionDisplay';
import React from 'react';
import { useUser } from '@clerk/nextjs';

const FormBuilderPage = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <FormSectionDisplayProvider>
        <>
          <TopHeader />
          <SectionDisplay />
        </>
      </FormSectionDisplayProvider>
    );
  }
};

export default FormBuilderPage;
