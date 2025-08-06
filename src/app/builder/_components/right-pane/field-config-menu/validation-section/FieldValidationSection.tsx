import FormConfigSection from '@/components/common/FormConfigSection';
import { CheckCircle } from 'lucide-react';
import React, { memo, useMemo, useState } from 'react';
import {
  FieldExactLength,
  FieldStartsWith,
  FieldEndsWith,
  FieldMinLength,
  FieldMaxLength,
  FieldContains,
  FieldMatchesRegex,
  FieldNoWhitespace,
  FieldIsEmail,
  FieldIsURL,
  FieldIsNumeric,
  FieldIsAlpha,
  FieldNoSpecialCharacters,
  FieldRequired,
  DateFieldIsBefore,
  DateFieldIsAfter,
  DateFieldRestrictFutureDate,
  DateFieldRestrictPastDate,
  DateFieldRequired,
  CheckboxFieldRequired,
  CheckboxFieldMinCount,
  CheckboxFieldMaxCount,
  FieldIsValidPhoneNumber,
  RadioFieldEquals,
  CheckboxFieldContains,
  TextFieldEquals,
  DropdownFieldContains,
  FileUploadFieldRequired,
  FileUploadFieldMaxFileSize,
  FileUploadFieldMaxCount,
  FileUploadFieldMinCount,
} from './Fields';
import { Button } from '@/components/ui/button';
import { useSelectedFieldStore } from '@/zustand/store';
// Phase 4: Import validation registry integration
import { useValidationRegistry, useFieldValidations } from '@/components/fields/validation/useValidationRegistry';
import { ValidationChangeData } from '@/components/fields/base/FieldTypes';

const FieldValidationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  const updateSelectedField = useSelectedFieldStore((s) => s?.updateSelectedField);
  
  // Phase 4: Initialize validation registry
  useValidationRegistry();
  
  // Phase 4: Get validations from registry for current field type
  const registryValidations = useFieldValidations(selectedField?.type || 'text');
  
  // Phase 4: Handle validation changes from registry components
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
          type: (validationData.enabled ? 
            (validationData.value === true || validationData.value === false ? 'binary' : 'withValue') 
            : 'binary') as 'binary' | 'withValue'
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

  // Legacy field components (keeping for backward compatibility)
  const fields = useMemo(() => {
    if (!selectedField) return [];

    const fieldComponents = [];

    switch (selectedField.type) {
      case 'text':
      case 'textarea':
        fieldComponents.push(
          FieldRequired,
          FieldExactLength,
          FieldMinLength,
          FieldMaxLength,
          TextFieldEquals,
          FieldStartsWith,
          FieldEndsWith,
          FieldContains,
          FieldMatchesRegex,
          FieldNoWhitespace,
          FieldIsValidPhoneNumber,
          FieldIsEmail,
          FieldIsURL,
          FieldIsNumeric,
          FieldIsAlpha,
          FieldNoSpecialCharacters,
        );
        break;
      case 'date':
        fieldComponents.push(
          DateFieldRequired,
          DateFieldRestrictPastDate,
          DateFieldRestrictFutureDate,
          DateFieldIsBefore,
          DateFieldIsAfter,
        );
        break;
      case 'radio':
        fieldComponents.push(FieldRequired, RadioFieldEquals);
        break;
      case 'checkbox':
        fieldComponents.push(
          CheckboxFieldRequired,
          CheckboxFieldMinCount,
          CheckboxFieldMaxCount,
          CheckboxFieldContains,
        );
        break;
      case 'dropdown':
        fieldComponents.push(
          CheckboxFieldRequired,
          CheckboxFieldMinCount,
          CheckboxFieldMaxCount,
          DropdownFieldContains,
        );
        break;
      case 'file':
        fieldComponents.push(
          FileUploadFieldRequired,
          FileUploadFieldMinCount,
          FileUploadFieldMaxCount,
          FileUploadFieldMaxFileSize,
        );
        break;
      default:
        break;
    }

    return fieldComponents;
  }, [selectedField]);

  // Phase 4: Render registry validation components
  const renderRegistryValidations = () => {
    if (!selectedField) return [];
    
    return registryValidations.map((validation, index) => {
      const Component = validation.component;
      const props = getValidationProps(validation.key);

      return (
        <Component
          key={`registry-${selectedField.id}-${validation.key}-${index}`}
          field={selectedField}
          onValidationChange={handleValidationChange}
          {...props}
        />
      );
    });
  };

  const renderFields = () => {
    // Phase 4: Show registry validations if available, otherwise fall back to legacy
    const hasRegistryValidations = registryValidations.length > 0;
    
    if (hasRegistryValidations) {
      const allValidations = renderRegistryValidations();
      
      if (allValidations.length > 6) {
        return (
          <>
            {allValidations.slice(0, 4)}
            {showMore && allValidations.slice(4)}
            <div className="flex justify-center">
              <Button variant="secondary" onClick={() => setShowMore(!showMore)}>
                {showMore ? 'Show less...' : 'Show more...'}
              </Button>
            </div>
          </>
        );
      }
      return allValidations;
    }

    // Legacy rendering for backward compatibility
    if (fields.length > 7) {
      return (
        <>
          {fields.slice(0, 4).map((Field, idx) => (
            <Field key={idx} />
          ))}
          {showMore && fields.slice(4).map((Field, idx) => <Field key={idx} />)}
          <div className="flex justify-center">
            <Button variant={'secondary'} onClick={() => setShowMore(!showMore)}>
              {showMore ? 'Show less...' : 'Show more...'}
            </Button>
          </div>
        </>
      );
    }
    return fields.map((Field, idx) => <Field key={idx} />);
  };

  if (!selectedField) return null;

  return (
    <FormConfigSection
      subtitle={registryValidations.length > 0 ? 
        "Configure validation rules using the integrated validation system" : 
        "Setup validations for your fields quickly"
      }
      icon={<CheckCircle className="w-4 h-4 text-white/90" />}
      title="Field validation"
      key={selectedField?.id}
      className="pb-40"
    >
      {renderFields()}
    </FormConfigSection>
  );
};

export default memo(FieldValidationSection);
