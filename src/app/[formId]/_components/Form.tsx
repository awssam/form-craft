'use client';

import { cn } from '@/lib/utils';
import type { FormConfig } from '@/types/form-config';
import React from 'react';
import FormContent from './FormContent';
import FormHeader from './FormHeader';
import { FieldValues } from 'react-hook-form';

export interface FormProps {
  formConfig: FormConfig;
}

type FormValueByPageMap = Record<string, Record<string, unknown>>;

const classes = cn(
  'flex flex-col gap-3 border-yellow-200/10 px-3 py-5 md:px-7 md:py-5 mx-auto my-auto border border-dashed rounded-md w-[95%] md:w-[min(80%,800px)] transition-all duration-200',
);

const Form = ({ formConfig: config }: FormProps) => {
  const [formValuesByPage, setFormValuesByPage] = React.useState<FormValueByPageMap>({});
  const [formConfig] = React.useState(config);
  const [activePageId, setActivePageId] = React.useState(formConfig?.pages?.[0]);

  const handleFormSubmit = (data: FieldValues) => {
    setFormValuesByPage((prev) => ({ ...prev, [activePageId]: data }));
  };

  // useEffect(() => {
  //   const getFieldUpdateWithCorrectValidationType = (
  //     fieldId: string,
  //     fieldType: FieldType,
  //     validationType: CustomValidationType,
  //     validatorKey: string,
  //   ) => {
  //     const field = fieldEntities?.[fieldId];
  //     const fieldValidations =
  //       CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ?? CUSTOM_FIELD_VALIDATIONS.text;

  //     const validationMap = fieldValidations?.[validationType as keyof typeof fieldValidations];
  //     const customValidation = field?.validation?.custom?.[validatorKey];

  //     let validationFn: ((value: string) => boolean) | null = null;
  //     let args: unknown[] = [];

  //     if (validationType === 'withValue') {
  //       args = [customValidation?.value, customValidation?.message];
  //     }

  //     if (validationType === 'binary') {
  //       args = [customValidation?.message];
  //     }

  //     const validationFunctor = validationMap?.[validatorKey as keyof typeof validationMap] as (
  //       ...args: unknown[]
  //     ) => (value: string) => boolean;

  //     validationFn = validationFunctor?.(...args);

  //     return {
  //       [validatorKey]: validationFn ?? (() => true),
  //     };
  //   };

  //   fields?.forEach((fieldId) => {
  //     const field = fieldEntities?.[fieldId];
  //     const fieldUpdates = {
  //       validation: {
  //         ...field?.validation,
  //         validate: {
  //           ...field?.validation?.validate,
  //         },
  //       },
  //     };

  //     Object.entries(field?.validation?.custom || {})?.forEach(([key, value]) => {
  //       const fieldType = field?.type as FieldType;
  //       fieldUpdates.validation.validate = {
  //         ...fieldUpdates.validation.validate,
  //         ...getFieldUpdateWithCorrectValidationType(fieldId, fieldType, value?.type, key),
  //       };
  //     });

  //     updateFormField(fieldId, fieldUpdates);
  //   });
  // }, [formConfig]);

  return (
    <section className={classes} style={{ backgroundColor: formConfig?.theme?.properties?.formBackgroundColor }}>
      <FormHeader formConfig={formConfig} />
      <FormContent
        key={activePageId} // should destroy and re-render when activePageId changes
        formConfig={formConfig}
        formValuesByPageMap={formValuesByPage}
        activePageId={activePageId}
        onActivePageIdChange={setActivePageId}
        onFormSubmit={handleFormSubmit}
      />
    </section>
  );
};

export default Form;
