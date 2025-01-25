'use client';

import { cn } from '@/lib/utils';
import type { CustomValidationType, FieldType, FormConfig } from '@/types/form-config';
import React, { useCallback, useEffect, useMemo } from 'react';
import FormContent from './FormContent';
import FormHeader from './FormHeader';
import { FieldValues } from 'react-hook-form';
import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import useFieldConditionalLogicCheckGeneric from '@/hooks/useFieldConditionalLogicCheck';

export interface FormProps {
  formConfig: FormConfig;
}

type FormValueByPageMap = Record<string, Record<string, unknown>>;

const classes = cn(
  'flex flex-col gap-3 border-yellow-200/10 px-3 py-5 md:px-7 md:py-5 mx-auto my-auto border border-dashed rounded-md w-[95%] md:w-[min(80%,800px)] transition-all duration-200',
);

const Form = ({ formConfig: config }: FormProps) => {
  const [formValuesByPage, setFormValuesByPage] = React.useState<FormValueByPageMap>({});
  const [formConfig, setFormConfig] = React.useState(config);
  const [activePageId, setActivePageId] = React.useState(formConfig?.pages?.[0]);
  const [fieldEntities, setFieldEntities] = React.useState(config?.fieldEntities);
  const [fieldVisibilityMap, setFieldVisibiltyMap] = React.useState<Record<string, boolean>>({});
  const allFields = useMemo(() => Object.keys(formConfig.fieldEntities), [formConfig?.fieldEntities]);

  const handleFormSubmit = (data: FieldValues) => {
    setFormValuesByPage((prev) => ({ ...prev, [activePageId]: data }));
  };

  const handleActivePageIdChange = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const handleFieldVisibilityChange = useCallback((fieldId: string, isVisible: boolean) => {
    setFieldVisibiltyMap((prev) => ({ ...prev, [fieldId]: isVisible }));
  }, []);

  useEffect(() => {
    const fieldEntities = config?.fieldEntities;

    const pages = config?.pages;

    const getFieldUpdateWithCorrectValidationType = (
      fieldId: string,
      fieldType: FieldType,
      validationType: CustomValidationType,
      validatorKey: string,
    ) => {
      const field = fieldEntities?.[fieldId];
      const fieldValidations =
        CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ?? CUSTOM_FIELD_VALIDATIONS.text;

      const validationMap = fieldValidations?.[validationType as keyof typeof fieldValidations];
      const customValidation = field?.validation?.custom?.[validatorKey];

      let validationFn: ((value: string) => boolean) | null = null;
      let args: unknown[] = [];

      if (validationType === 'withValue') {
        args = [customValidation?.value, customValidation?.message];
      }

      if (validationType === 'binary') {
        args = [customValidation?.message];
      }

      const validationFunctor = validationMap?.[validatorKey as keyof typeof validationMap] as (
        ...args: unknown[]
      ) => (value: string) => boolean;

      validationFn = validationFunctor?.(...args);

      return {
        [validatorKey]: validationFn ?? (() => true),
      };
    };

    pages?.forEach((pageId) => {
      const fields = config?.pageEntities?.[pageId]?.fields;

      fields?.forEach((fieldId) => {
        const field = fieldEntities?.[fieldId];
        const fieldUpdates = {
          validation: {
            ...field?.validation,
            validate: {
              ...field?.validation?.validate,
            },
          },
        };

        Object.entries(field?.validation?.custom || {})?.forEach(([key, value]) => {
          const fieldType = field?.type as FieldType;
          fieldUpdates.validation.validate = {
            ...fieldUpdates.validation.validate,
            ...getFieldUpdateWithCorrectValidationType(fieldId, fieldType, value?.type, key),
          };
        });

        setFormConfig((prev) => {
          return {
            ...prev,
            fieldEntities: {
              ...prev?.fieldEntities,
              [fieldId]: {
                ...prev?.fieldEntities?.[fieldId],
                ...fieldUpdates,
              },
            },
          };
        });
      });
    });
  }, [config]);

  useFieldConditionalLogicCheckGeneric(allFields!, fieldEntities, handleFieldVisibilityChange);

  return (
    <section className={classes} style={{ backgroundColor: formConfig?.theme?.properties?.formBackgroundColor }}>
      <FormHeader formConfig={formConfig} />
      <FormContent
        key={activePageId} // should destroy and re-render when activePageId changes
        formConfig={formConfig}
        formValuesByPageMap={formValuesByPage}
        fieldVisibilityMap={fieldVisibilityMap}
        activePageId={activePageId}
        onActivePageIdChange={handleActivePageIdChange}
        onFormSubmit={handleFormSubmit}
        onPageFieldChange={setFieldEntities}
        onFormValueChange={setFormValuesByPage}
      />
    </section>
  );
};

export default Form;
