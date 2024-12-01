import React from 'react';
import FieldConfigSection from './config-section/FieldConfigSection';
import FieldValidationSection from './validation-section/FieldValidationSection';
import FieldConditionalLogicSection from './conditional-logic-section/ConditionalLogicSection';
const FieldConfigMenu = () => {
  return (
    <>
      <FieldConfigSection />
      <FieldConditionalLogicSection />
      <FieldValidationSection />
    </>
  );
};

export default FieldConfigMenu;
