import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity } from '@/types/form-config';
import { useEffect } from 'react';

const useFieldConditionalLogicCheckGeneric = (
  fields: string[],
  fieldEntities: Record<string, FieldEntity> | null,
  onFieldVisibilityChange: (fieldId: string, isVisible: boolean) => void,
) => {
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

          conditions.push(isValid === true);
        });

        if (operator === 'OR') {
          const isAnyConditionTrue = conditions.some((c) => c);
          onFieldVisibilityChange(fieldId, isAnyConditionTrue);
          return;
        }

        if (operator === 'AND') {
          const isAllConditionTrue = conditions.every((c) => c);
          onFieldVisibilityChange(fieldId, isAllConditionTrue);
          return;
        }
      }
    });
  }, [fields, fieldEntities, onFieldVisibilityChange]);

  return null;
};

export default useFieldConditionalLogicCheckGeneric;
