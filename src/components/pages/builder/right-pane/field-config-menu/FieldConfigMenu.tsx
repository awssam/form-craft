import React from 'react';
import FieldConfigSection from './config-section/FieldConfigSection';
import FieldValidationSection from './validation-section/FieldValidationSection';
import FieldConditionalLogicSection from './conditional-logic-section/ConditionalLogicSection';
import FieldActionSection from './action-section/FieldActionSection';
const FieldConfigMenu = () => {
  return (
    <>
      <FieldActionSection />
      <FieldConfigSection />
      <FieldConditionalLogicSection />
      <FieldValidationSection />
    </>
  );
};

export default FieldConfigMenu;
