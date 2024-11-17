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
  FieldIsAlphanumeric,
  FieldNoSpecialCharacters,
  FieldRequired,
  DateFieldIsBefore,
  DateFieldIsAfter,
  DateFieldMatchesFormat,
  DateFieldRestrictFutureDate,
  DateFieldRestrictPastDate,
  DateFieldRequired,
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
        FieldStartsWith,
        FieldEndsWith,
        FieldContains,
        FieldMatchesRegex,
        FieldNoWhitespace,
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

    if (fields?.length > 4) {
      return (
        <>
          {fields?.slice(0, 4).map((Field, idx) => (
            <Field key={idx} />
          ))}
          {showMore && fields?.slice(4, fields?.length).map((Field, idx) => <Field key={idx} />)}
          <div className="flex justify-center">
            <Button onClick={() => setShowMore(!showMore)}>{showMore ? 'Show less...' : 'Show more...'}</Button>
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
      icon={<CheckCircle className="w-4 h-4 text-muted-foreground" />}
      title="Field validation"
      key={selectedField?.id}
    >
      {renderFieldValidation()}
    </FormConfigSection>
  );
};

export default FieldValidationSection;
