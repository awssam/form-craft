import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity } from '@/types/form-config';
import { useFieldVisibilityStore, useFormActionProperty, useFormProperty } from '@/zustand/store';
import { useEffect } from 'react';

const useFieldConditionalLogicCheck = (fields: string[]) => {
  // // validate conditional logic for all fields
  const fieldEntities = useFormProperty('fieldEntities');
  const setFieldVisibility = useFieldVisibilityStore((s) => s.setFieldVisibility);

  useEffect(() => {
    fields?.forEach((fieldId) => {
      const field = fieldEntities?.[fieldId]!;

      if (field.conditionalLogic) {
        // conditional logic validation

        const { showWhen } = field.conditionalLogic || {};
        const conditions: Boolean[] = [];

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

          const functor = availableFieldValidations?.[operator as keyof typeof availableFieldValidations] as Function;
          const validationFn = functor ? functor(value) : () => true;

          console.log(condition, validationFn, functor, fieldEntities?.[fieldId]);

          const isValid = validationFn(conditionalFieldValue);
          console.log(isValid, conditionalFieldValue, value);

          conditions.push(isValid);
        });

        const isAllConditionFalse = conditions.every((c) => !c);

        setFieldVisibility(fieldId, !isAllConditionFalse);
      }
    });
  }, [fields, fieldEntities]);

  return null;
};

export default useFieldConditionalLogicCheck;
