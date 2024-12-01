import React, { memo, useCallback, useMemo, useState } from 'react';
import { ShieldQuestion } from 'lucide-react';
import FormConfigSection from '@/components/common/FormConfigSection';
import { useFormProperty, useSelectedFieldStore } from '@/zustand/store';
import FormField from '@/components/common/FormField';
import { Combobox, Option } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { ConditionalLogic, ConditionalLogicOperator, CustomValidationType } from '@/types/form-config';
import { Button } from '@/components/ui/button';
import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { DateTimePicker } from '@/components/ui/datepicker';

const defaultConditionalLogic: ConditionalLogic = {
  showWhen: [
    {
      fieldId: '',
      operator: 'required',
      value: '',
      label: '',
      operatorType: 'binary',
    },
  ],
  operator: 'AND',
};

type OptionWithType = Option & {
  type: CustomValidationType;
};

const FieldConditionalLogicSection = () => {
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const fieldEntities = useFormProperty('fieldEntities');
  const updateSelectedField = useSelectedFieldStore((s) => s?.updateSelectedField);

  const updateConditionalLogic = (index: number, updates: Partial<ConditionalLogic['showWhen'][0]>) => {
    const updatedShowWhen = selectedField?.conditionalLogic?.showWhen?.map((c, i) => {
      return i === index ? { ...c, ...updates } : c;
    }) ?? [{ ...defaultConditionalLogic.showWhen[0], ...updates }];

    updateSelectedField({
      conditionalLogic: {
        showWhen: updatedShowWhen,
        operator: 'AND', // Assuming the operator remains constant for now
      },
    });
  };

  const handleFieldChange = (selectedField: Option, index: number) => {
    updateConditionalLogic(index, {
      fieldId: selectedField?.value as string,
      label: selectedField?.label,
      value: '', // Resetting the value when the field changes
    });
  };

  const handleOperatorChange = (selectedOperator: OptionWithType, index: number) => {
    updateConditionalLogic(index, {
      operator: selectedOperator?.value as ConditionalLogicOperator,
      operatorType: selectedOperator?.type as CustomValidationType,
    });
  };

  const handleValueChange = (value: string, index: number) => {
    updateConditionalLogic(index, {
      value,
    });
  };

  const getValidationOptions = useCallback(
    (fieldId: string): OptionWithType[] => {
      const fieldType = fieldEntities?.[fieldId]?.type;
      const validations =
        CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ?? CUSTOM_FIELD_VALIDATIONS.text;
      const withValue = Object.keys(validations?.withValue ?? {}).map((validatorKey) => {
        return {
          label: validatorKey,
          value: validatorKey,
          type: 'withValue' as CustomValidationType,
        };
      });
      const binary = Object.keys(validations?.binary ?? {}).map((validatorKey) => {
        return {
          label: validatorKey,
          value: validatorKey,
          type: 'binary' as CustomValidationType,
        };
      });

      return [...withValue, ...binary];
    },
    [fieldEntities],
  );

  const fieldOptions = useMemo(() => {
    return Object.values(fieldEntities || {})
      ?.filter((d) => d.id !== selectedField?.id)
      .map((entity) => ({
        label: entity.label,
        value: entity.id,
      }));
  }, [fieldEntities, selectedField]);

  if (!selectedField) return null;

  const renderValueSpecifierInput = (condition: ConditionalLogic['showWhen'][0], index: number) => {
    const isBinary = condition?.operatorType === 'binary';

    if (isBinary) return null;

    const fieldType = fieldEntities?.[condition?.fieldId]?.type;

    switch (fieldType) {
      case 'date':
        return (
          <DateTimePicker
            value={condition?.value ? new Date(condition?.value as string) : undefined}
            placeholder="Enter a value"
            className="w-full"
            granularity="day"
            onChange={(date) => handleValueChange(date?.toISOString() ?? '', index)}
          />
        );
      default:
        return (
          <Input
            value={condition?.value as string}
            placeholder="Enter a value"
            onChange={(e) => handleValueChange(e.target?.value, index)}
          />
        );
    }
  };

  return (
    <FormConfigSection
      icon={<ShieldQuestion className="w-4 h-4 text-muted-foreground" />}
      title="Conditional Logic"
      subtitle="Show or hide this field based on the value of another field"
      key={selectedField?.id}
    >
      {selectedField?.conditionalLogic?.showWhen?.map((condition, index) => {
        return (
          <section
            key={condition.fieldId}
            className="space-y-4 border border-dashed border-input bg-background px-3 py-5 rounded-md flex flex-col gap-3"
          >
            <FormField label="Show this field if" id="field" helperText="Select a field and specify the condition.">
              <Combobox
                options={fieldOptions}
                selectedValues={condition?.fieldId ? [{ label: condition.label, value: condition.fieldId }] : []}
                handleChange={(value) => handleFieldChange(value?.[0], index)}
              />
            </FormField>

            {condition?.fieldId && (
              <>
                <FormField
                  label="Condition"
                  id="condition"
                  helperText="Select an operator and specify the value that must be met."
                >
                  <Combobox
                    placeholder="Select an operator"
                    options={getValidationOptions(condition?.fieldId)}
                    selectedValues={
                      condition.operator ? [{ label: condition?.operator, value: condition?.operator }] : []
                    }
                    handleChange={(value) => handleOperatorChange(value?.[0] as OptionWithType, index)}
                  />
                </FormField>

                {condition?.operatorType !== 'binary' && (
                  <FormField
                    label={`Value for ${condition.label}`}
                    id="conditionValue"
                    helperText="Specify the value that must be met."
                  >
                    {renderValueSpecifierInput(condition, index)}
                  </FormField>
                )}
              </>
            )}
          </section>
        );
      })}
      {!selectedField?.conditionalLogic?.showWhen?.length && (
        <>
          <Button variant="outline" onClick={() => handleFieldChange(fieldOptions?.[0], 0)}>
            Add Condition
          </Button>
        </>
      )}
    </FormConfigSection>
  );
};

export default memo(FieldConditionalLogicSection);
