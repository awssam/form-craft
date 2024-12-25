import React, { memo, useCallback, useMemo } from 'react';
import { ShieldQuestion } from 'lucide-react';
import FormConfigSection from '@/components/common/FormConfigSection';
import { useFormProperty, useSelectedFieldStore } from '@/zustand/store';
import FormField from '@/components/common/FormField';
import { Combobox, Option } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { ConditionalLogic, ConditionalLogicOperator, CustomValidationType } from '@/types/form-config';
import { Button } from '@/components/ui/button';
import { CONDITIONAL_LOGIC_VALIDATIONS } from '@/lib/validation';
import { DateTimePicker } from '@/components/ui/datepicker';
import { camelCaseToReadable } from '@/lib/utils';

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

const conditionalOperators = [
  {
    label: 'AND (Only visible if all conditions are met)',
    value: 'AND',
  },
  {
    label: 'OR (Visible if any one condition is met)',
    value: 'OR',
  },
];

const FieldConditionalLogicSection = () => {
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const fieldEntities = useFormProperty('fieldEntities');
  const updateSelectedField = useSelectedFieldStore((s) => s?.updateSelectedField);

  const { operator: conditionalLogicOperator } = selectedField?.conditionalLogic ?? {};

  const updateConditionalLogic = (
    index: number,
    updates: Partial<ConditionalLogic['showWhen'][0]>,
    isRemove: boolean = false,
  ) => {
    const defaultOperatorVal = (
      conditionalLogicOperator || (selectedField?.conditionalLogic?.showWhen?.length || 0) >= 1
        ? 'AND'
        : conditionalLogicOperator
    ) as ConditionalLogic['operator'];

    if (isRemove) {
      const updatedShowWhen = selectedField?.conditionalLogic?.showWhen?.filter((c, i) => i !== index);

      updateSelectedField({
        conditionalLogic: {
          showWhen: updatedShowWhen ?? [],
          operator: defaultOperatorVal,
        },
      });
      return;
    }

    const updatedShowWhen = selectedField?.conditionalLogic?.showWhen?.map((c, i) => {
      return i === index ? { ...c, ...updates } : c;
    }) ?? [{ ...defaultConditionalLogic.showWhen[0], ...updates }];

    if (index === selectedField?.conditionalLogic?.showWhen?.length) {
      updatedShowWhen.unshift({ ...defaultConditionalLogic.showWhen[0], ...updates });
    }

    updateSelectedField({
      conditionalLogic: {
        showWhen: updatedShowWhen,
        operator: defaultOperatorVal,
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
        CONDITIONAL_LOGIC_VALIDATIONS?.[fieldType as keyof typeof CONDITIONAL_LOGIC_VALIDATIONS] ??
        CONDITIONAL_LOGIC_VALIDATIONS.text;
      const withValue = Object.keys(validations?.withValue ?? {}).map((validatorKey) => {
        return {
          label: camelCaseToReadable(validatorKey),
          value: validatorKey,
          type: 'withValue' as CustomValidationType,
        };
      });
      const binary = Object.keys(validations?.binary ?? {}).map((validatorKey) => {
        return {
          label: camelCaseToReadable(validatorKey),
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
            value={typeof condition?.value !== 'object' ? new Date(condition?.value as string) : condition?.value}
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

  const handleUpdateOperator = (operator: ConditionalLogic['operator']) => {
    updateSelectedField({
      conditionalLogic: {
        showWhen: selectedField?.conditionalLogic?.showWhen ?? [],
        operator,
      },
    });
  };

  const getOption = (label: string, value: string) => ({
    label,
    value,
  });

  const getRandomIndexFromList = (len: number) => Math.floor(Math.random() * len);

  return (
    <FormConfigSection
      icon={<ShieldQuestion className="w-4 h-4 text-white/90" />}
      title="Conditional Logic"
      subtitle="Show or hide this field based on the value of another field"
      key={selectedField?.id}
    >
      {(selectedField?.conditionalLogic?.showWhen?.length || 0) > 1 && (
        <Combobox
          options={conditionalOperators}
          placeholder="Select conditional logic operator"
          selectedValues={
            selectedField?.conditionalLogic?.operator
              ? [
                  getOption(
                    conditionalOperators.find((o) => o.value === selectedField?.conditionalLogic?.operator)?.label ||
                      '',
                    conditionalLogicOperator!,
                  ),
                ]
              : []
          }
          handleChange={(value) => handleUpdateOperator(value?.[0]?.value as ConditionalLogic['operator'])}
        />
      )}

      <Button
        variant="secondary"
        onClick={() =>
          handleFieldChange(
            fieldOptions?.[getRandomIndexFromList(fieldOptions?.length || 0)],
            selectedField?.conditionalLogic?.showWhen?.length || 0,
          )
        }
      >
        Add Condition
      </Button>
      {selectedField?.conditionalLogic?.showWhen?.map((condition, index) => {
        return (
          <section
            key={index}
            className="space-y-4 border border-dashed border-input bg-background px-3 py-5 rounded-md flex flex-col gap-3 hover:border-yellow-200/30 transition-colors duration-300"
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
                      condition.operator
                        ? [{ label: camelCaseToReadable(condition?.operator), value: condition?.operator }]
                        : []
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
            <Button variant="destructive" onClick={() => updateConditionalLogic(index, {}, true)}>
              Remove Condition
            </Button>
          </section>
        );
      })}
    </FormConfigSection>
  );
};

export default memo(FieldConditionalLogicSection);
