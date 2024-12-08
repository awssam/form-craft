import FormConfigSection from '@/components/common/FormConfigSection';
import { CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
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
} from './Fields';
import { Button } from '@/components/ui/button';
import { useSelectedFieldStore } from '@/zustand/store';

const FieldValidationSection = () => {
  const [showMore, setShowMore] = useState(false);
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);

  const renderFieldValidation = () => {
    if (!selectedField) return;

    const fields = [];

    if (selectedField?.type === 'text' || selectedField?.type === 'textarea') {
      fields.push(
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
    }

    if (selectedField?.type === 'date') {
      fields.push(
        DateFieldRequired,
        DateFieldRestrictPastDate,
        DateFieldRestrictFutureDate,
        DateFieldIsBefore,
        DateFieldIsAfter,
      );
    }

    if (selectedField?.type === 'radio') {
      fields.push(FieldRequired, RadioFieldEquals);
    }

    if (selectedField?.type === 'checkbox') {
      fields.push(CheckboxFieldRequired, CheckboxFieldMinCount, CheckboxFieldMaxCount, CheckboxFieldContains);
    }

    if (fields?.length > 7) {
      return (
        <>
          {fields?.slice(0, 4).map((Field, idx) => (
            <Field key={idx} />
          ))}
          {showMore && fields?.slice(4, fields?.length).map((Field, idx) => <Field key={idx} />)}
          <div className="flex justify-center">
            <Button variant={'secondary'} onClick={() => setShowMore(!showMore)}>
              {showMore ? 'Show less...' : 'Show more...'}
            </Button>
          </div>
        </>
      );
    }
    return fields?.map((Field, idx) => <Field key={idx} />);
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
      {renderFieldValidation()}
    </FormConfigSection>
  );
};

export default FieldValidationSection;
