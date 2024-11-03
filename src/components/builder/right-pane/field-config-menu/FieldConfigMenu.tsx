import React from "react";
import FieldConfigSection from "./config-section/FieldConfigSection";
import FieldValidationSection from "./validation-section/FieldValidationSection";

const FieldConfigMenu = () => {
  return (
    <>
      <FieldConfigSection />
      <FieldValidationSection />
    </>
  );
};

export default FieldConfigMenu;
