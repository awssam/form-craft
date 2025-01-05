import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity } from '@/types/form-config';
import { useFieldVisibilityStore, useFormProperty } from '@/zustand/store';
import { useEffect } from 'react';

const useFieldConditionalLogicCheck = (fields: string[]) => {
  // // validate conditional logic for all fields
  const fieldEntities = useFormProperty('fieldEntities');
  const setFieldVisibility = useFieldVisibilityStore((s) => s.setFieldVisibility);

  useEffect(() => {
    fields?.forEach((fieldId) => {
      const field = fieldEntities?.[fieldId] as FieldEntity;

      if (field?.conditionalLogic) {
        // conditional logic validation

        const { showWhen, operator } = field.conditionalLogic || {};
        const conditions: boolean[] = [];

        showWhen?.forEach((condition) => {
          const operator = condition?.operator;
          const value = condition?.value;
          const fieldId = condition?.fieldId;
          const operatorType = condition?.operatorType;
          const fieldType = fieldEntities?.[fieldId]?.type;
          const conditionalFieldValue = fieldEntities?.[fieldId]?.value as string;

          const validationMap =
            CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ??
            CUSTOM_FIELD_VALIDATIONS.text;
          const availableFieldValidations = validationMap?.[operatorType as keyof typeof validationMap];

          const functor = availableFieldValidations?.[operator as keyof typeof availableFieldValidations] as (
            v: unknown,
          ) => (val: string) => boolean;
          const validationFn = functor ? functor?.(value) : () => true;

          const isValid = validationFn(conditionalFieldValue);

          conditions.push(isValid);
        });

        if (operator === 'OR') {
          const isAnyConditionTrue = conditions.some((c) => c);
          setFieldVisibility(fieldId, isAnyConditionTrue);
          return;
        }

        if (operator === 'AND') {
          const isAllConditionTrue = conditions.every((c) => c);
          setFieldVisibility(fieldId, isAllConditionTrue);
          return;
        }
      }
    });
  }, [fields, fieldEntities, setFieldVisibility]);

  return null;
};

export default useFieldConditionalLogicCheck;
