import React from 'react';

import Header from './Header';
import FormInfoSection from './form-info/FormInfo';
import FormStructureSection from './form-structure/FormStructure';
import FormCustomizationSection from './form-customization/FormCustomization';

import { cn } from '@/lib/utils';
import { GenericProps } from '@/types/common';
import FormIntegrations from './form-integrations/FormIntegrations';

const LeftPane = ({ className }: GenericProps) => {
  const classes = cn('h-full flex bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto', className);

  return (
    <div className={classes}>
      <Header />
      <FormInfoSection />
      <FormIntegrations />
      <FormCustomizationSection />
      <FormStructureSection />
    </div>
  );
};

export default LeftPane;
