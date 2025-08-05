import React from 'react';
import FieldConfigSection from './config-section/FieldConfigSection';
import FieldValidationSection from './validation-section/FieldValidationSection';
import FieldConditionalLogicSection from './conditional-logic-section/ConditionalLogicSection';
import FieldActionSection from './action-section/FieldActionSection';
import FieldMappingSection from './mapping-section/FieldMappingSection';
import { useFormProperty } from '@/zustand/store';

const FieldConfigMenu = () => {
    const formType = useFormProperty('formType');
  
  return (
    <>
      <FieldActionSection />
      <FieldConfigSection />
      {formType != 'general' && (
        <FieldMappingSection />
      )}
      
      <FieldConditionalLogicSection />
      <FieldValidationSection />
    </>
  );
};

export default FieldConfigMenu;
