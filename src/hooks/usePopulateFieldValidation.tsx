import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { CustomValidationType, FieldType } from '@/types/form-config';
import { useFormActionProperty, useFormProperty } from '@/zustand/store';
import { useEffect, useMemo } from 'react';

const usePopulateFieldValidation = (pageId: string) => {
  const pageEntities = useFormProperty('pageEntities');
  const fieldEntities = useFormProperty('fieldEntities');
  const updateFormField = useFormActionProperty('updateFormField');
  const fields = useMemo(() => pageEntities?.[pageId]?.fields, [pageEntities, pageId]);

  useEffect(() => {
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

      updateFormField(fieldId, fieldUpdates);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, updateFormField]);

  return null;
};

export default usePopulateFieldValidation;
