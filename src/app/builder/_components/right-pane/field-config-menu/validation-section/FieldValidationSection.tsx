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

const FieldValidationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  const fields = useMemo(() => {
    if (!selectedField) return [];

    const fieldComponents = [];

        switch (selectedField.type) {
          case 'text':
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
              FieldIsAlpha,
              FieldIsNumeric,
              FieldNoSpecialCharacters,
            );
            break;
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
              FieldNoSpecialCharacters,
            );
            break;
          case 'email':
            fieldComponents.push(
              FieldRequired,
              FieldIsEmail,
              FieldMaxLength,
              FieldMinLength,
            );
            break;
          case 'phone':
            fieldComponents.push(
              FieldRequired,
              FieldIsValidPhoneNumber,
              FieldMaxLength,
              FieldMinLength,
            );
            break;
          case 'url':
            fieldComponents.push(
              FieldRequired,
              FieldIsURL,
              FieldMaxLength,
              FieldMinLength,
            );
            break;
          case 'number':
            fieldComponents.push(
              FieldRequired,
              FieldIsNumeric,
              FieldMaxLength,
              FieldMinLength,
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
          case 'datetime':
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

  const renderFields = () => {
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
      subtitle="Setup validations for your fields quickly"
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
