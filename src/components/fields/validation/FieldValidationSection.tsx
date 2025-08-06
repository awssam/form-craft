import React, { memo, useMemo, useState } from 'react';
import FormConfigSection from '@/components/common/FormConfigSection';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useSelectedFieldStore } from '@/zustand/store';
import { useValidationRegistry, useFieldValidations } from './useValidationRegistry';
import { ValidationChangeData } from '../base/FieldTypes';

/**
 * Enhanced Field Validation Section using the new validation registry system
 */
const EnhancedFieldValidationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const updateSelectedField = useSelectedFieldStore((s) => s?.updateSelectedField);
  
  // Initialize validation registry
  useValidationRegistry();
  
  // Get validations for the current field type
  const validations = useFieldValidations(selectedField?.type || 'text');
  
  // Organize validations by category
  const basicValidations = useMemo(() => 
    validations.filter(v => v.category === 'basic'), [validations]);
  const advancedValidations = useMemo(() => 
    validations.filter(v => v.category === 'advanced'), [validations]);
  const customValidations = useMemo(() => 
    validations.filter(v => v.category === 'custom'), [validations]);
  
  const allValidations = [...basicValidations, ...advancedValidations, ...customValidations];

  const handleValidationChange = (validationData: ValidationChangeData) => {
    if (!selectedField || !updateSelectedField) return;

    const currentValidation = selectedField.validation || { custom: {} };
    const customValidation = currentValidation.custom || {};

    // Update the field's validation configuration
    const updatedValidation = {
      ...currentValidation,
      custom: {
        ...customValidation,
        [validationData.key]: {
          value: validationData.value,
          message: validationData.message || '',
          type: validationData.enabled ? 
            (validationData.value === true || validationData.value === false ? 'binary' : 'withValue') 
            : 'binary'
        }
      }
    };

    // Remove the validation if it's disabled
    if (!validationData.enabled) {
      delete updatedValidation.custom[validationData.key];
    }

    updateSelectedField({
      validation: updatedValidation
    });
  };

  const getValidationProps = (validationKey: string) => {
    const currentValue = selectedField?.validation?.custom?.[validationKey];
    return {
      enabled: !!currentValue && currentValue.value !== false,
      value: currentValue?.value,
      message: currentValue?.message
    };
  };

  const renderValidationComponent = (validation: typeof validations[0], index: number) => {
    const Component = validation.component;
    const props = getValidationProps(validation.key);

    return (
      <Component
        key={`${selectedField?.id}-${validation.key}-${index}`}
        field={selectedField}
        onValidationChange={handleValidationChange}
        {...props}
      />
    );
  };

  const renderValidations = () => {
    if (allValidations.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-4">
          No validations available for this field type.
        </div>
      );
    }

    if (allValidations.length > 6) {
      return (
        <>
          {allValidations.slice(0, 4).map(renderValidationComponent)}
          {showMore && allValidations.slice(4).map(renderValidationComponent)}
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setShowMore(!showMore)}>
              {showMore ? 'Show less...' : 'Show more...'}
            </Button>
          </div>
        </>
      );
    }

    return allValidations.map(renderValidationComponent);
  };

  if (!selectedField) {
    return null;
  }

  return (
    <FormConfigSection
      subtitle="Configure validation rules using the enhanced validation system"
      icon={<CheckCircle className="w-4 h-4 text-white/90" />}
      title="Enhanced Field Validation"
      key={`enhanced-validation-${selectedField?.id}`}
      className="pb-40"
    >
      {basicValidations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Basic Validations</h4>
          {basicValidations.map(renderValidationComponent)}
        </div>
      )}
      
      {advancedValidations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Advanced Validations</h4>
          {advancedValidations.map(renderValidationComponent)}
        </div>
      )}
      
      {customValidations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Custom Validations</h4>
          {customValidations.map(renderValidationComponent)}
        </div>
      )}
      
      {(basicValidations.length === 0 && advancedValidations.length === 0 && customValidations.length === 0) && 
        renderValidations()
      }
    </FormConfigSection>
  );
};

export default memo(EnhancedFieldValidationSection);
