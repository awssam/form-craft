import React from 'react';
import FormHeaderContent from './FormHeader';
import SortableFormFieldContainer, { FormFieldsProps } from './SortableFormFieldContainer';

const FormContent = (props: FormFieldsProps) => {
  return (
    <>
      <FormHeaderContent />
      <SortableFormFieldContainer {...props} />
    </>
  );
};

export default FormContent;
