import FormField from '@/components/common/FormField';
import { Combobox } from '@/components/ui/combobox';
import { DateTimePicker } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity } from '@/types/form-config';
import { useSelectedFieldStore } from '@/zustand/store';
import { isValid } from '@/lib/datetime';
import { useMemo } from 'react';

const requiredOptions = [
  {
    label: 'Yes',
    value: 'true',
  },
  { label: 'No', value: 'false' },
];

const useSelectedField = () => useSelectedFieldStore((s) => s.selectedField);

// Text field validations

export const createValidationComponent = <T extends keyof typeof CUSTOM_FIELD_VALIDATIONS.text.withValue>(
  label: string,
  key: T,
  placeholder: string,
  cb: (v: string) => boolean,
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value: fieldValidationValue, message: fieldValidationMessage } =
      selectedField?.validation?.custom?.[key] || {};
    const updateSelectedField = debounce(
      useSelectedFieldStore((s) => s.updateSelectedField),
      500,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const validationValue = name === 'value' ? value : selectedField?.validation?.custom?.[key]?.value;
      const msg = name === 'message' ? value : selectedField?.validation?.custom?.[key]?.message;

      const validationFn = CUSTOM_FIELD_VALIDATIONS.text?.withValue[key](validationValue, msg);

      const getUpdatedField = (k: string, v: string | number) => ({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [key]: {
              ...selectedField?.validation?.custom?.[key],
              [k]: v,
              type: 'withValue',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [key]: k === 'value' ? (value?.length > 0 ? validationFn : () => true) : validationFn,
          },
        },
      });

      updateSelectedField(getUpdatedField(name, value) as unknown as FieldEntity);
    };

    return (
      <FormField id={key} label={label} key={selectedField?.id}>
        <Input
          name="value"
          placeholder={placeholder}
          type="text"
          defaultValue={fieldValidationValue ?? ''}
          onChange={handleChange}
        />
        {cb(fieldValidationValue) && (
          <Input
            defaultValue={fieldValidationMessage}
            name="message"
            className="mt-2"
            placeholder={`Eg: ${label} validation message`}
            onChange={handleChange}
          />
        )}
      </FormField>
    );
  };
};

export const FieldExactLength = createValidationComponent('Exact Length', 'exactLength', 'Eg: 5', (v) => +v > 0);

export const FieldStartsWith = createValidationComponent('Starts With', 'startsWith', 'Eg: Me', (v) => v?.length > 0);

export const FieldEndsWith = createValidationComponent('Ends With', 'endsWith', 'Eg: .com', (v) => v?.length > 0);

export const FieldMinLength = createValidationComponent('Minimum Length', 'minLength', 'Eg: 5', (v) => +v > 0);

export const FieldMaxLength = createValidationComponent('Maximum Length', 'maxLength', 'Eg: 20', (v) => +v > 0);

export const FieldContains = createValidationComponent('Contains', 'contains', 'Eg: world', (v) => v?.length > 0);

export const FieldMatchesRegex = createValidationComponent(
  'Matches Regex',
  'matchesRegex',
  'Eg: ^[a-zA-Z0-9]+$',
  (v) => v?.length > 0,
);

// Yes or No type Fields

export const createBinaryValidationComponent = (
  label: string,
  key: keyof typeof CUSTOM_FIELD_VALIDATIONS.text.binary,
  isRequired: boolean = false,
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value, message } = selectedField?.validation?.custom?.[key] || {};
    const updateSelectedField = debounce(
      useSelectedFieldStore((s) => s.updateSelectedField),
      500,
    );

    const required = useMemo(
      () => ({
        label: value ? 'Yes' : 'No',
        value: value ? 'true' : 'false',
      }),
      [value],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const validationFn = CUSTOM_FIELD_VALIDATIONS.text.binary?.[key](value);

      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [key]: {
              ...selectedField?.validation?.custom?.[key],
              message: value,
              type: 'binary',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [key]: validationFn,
          },
        },
      });
    };

    return (
      <FormField id={key} label={label} required={isRequired} key={selectedField?.id}>
        <Combobox
          options={requiredOptions}
          selectedValues={[required]}
          handleChange={(v) => {
            const validationFn = CUSTOM_FIELD_VALIDATIONS.text.binary?.[key](message || '');
            updateSelectedField({
              validation: {
                ...selectedField?.validation,
                custom: {
                  ...selectedField?.validation?.custom,
                  [key]: {
                    ...selectedField?.validation?.custom?.[key],
                    value: v[0].value === 'true',
                  },
                },
                validate: {
                  ...selectedField?.validation?.validate,
                  [key]: v[0].value === 'true' ? validationFn : () => true,
                },
              },
            });
          }}
        />
        {required?.value === 'true' && (
          <Input
            name="message"
            defaultValue={message}
            onChange={handleChange}
            className="mt-2"
            placeholder={`Eg: ${label} validation message`}
          />
        )}
      </FormField>
    );
  };
};

export const FieldRequired = createBinaryValidationComponent('Required', 'required', true);

export const FieldNoWhitespace = createBinaryValidationComponent('No Whitespace', 'noWhitespace');

export const FieldIsEmail = createBinaryValidationComponent('Is Email', 'isEmail');

export const FieldIsURL = createBinaryValidationComponent('Is URL', 'isURL');

export const FieldIsNumeric = createBinaryValidationComponent('Is Numeric', 'isNumeric');

export const FieldIsAlpha = createBinaryValidationComponent('Is Alpha', 'isAlpha');

export const FieldIsAlphanumeric = createBinaryValidationComponent('Is Alphanumeric', 'isAlphanumeric');

export const FieldNoSpecialCharacters = createBinaryValidationComponent('No Special Characters', 'noSpecialCharacters');

// Date type Fields

export const createValidationComponentForDate = (
  label: string,
  key: keyof typeof CUSTOM_FIELD_VALIDATIONS.date.withValue,
  placeholder: string,
  cb: (v: string) => boolean,
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value: fieldValidationValue, message: fieldValidationMessage } =
      selectedField?.validation?.custom?.[key] || {};
    const updateSelectedField = debounce(
      useSelectedFieldStore((s) => s.updateSelectedField),
      500,
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const validationValue = name === 'value' ? value : selectedField?.validation?.custom?.[key]?.value;
      const msg = name === 'message' ? value : selectedField?.validation?.custom?.[key]?.message;

      const validationFn = CUSTOM_FIELD_VALIDATIONS.date?.withValue?.[key](validationValue, msg);

      const getUpdatedField = (k: string, v: string | number) => ({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [key]: {
              ...selectedField?.validation?.custom?.[key],
              [k]: v,
              type: 'withValue',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [key]: k === 'value' ? (isValid(v) ? validationFn : () => true) : validationFn,
          },
        },
      });

      updateSelectedField(getUpdatedField(name, value) as unknown as FieldEntity);
    };

    return (
      <FormField id={key} label={label} key={selectedField?.id}>
        <DateTimePicker
          granularity="day"
          placeholder={placeholder}
          value={fieldValidationValue ? new Date(fieldValidationValue) : (null as unknown as Date)}
          onChange={(date: Date | undefined) => {
            handleChange({
              target: { name: 'value', value: date?.toISOString() },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
        />
        {cb(fieldValidationValue) && (
          <Input
            defaultValue={fieldValidationMessage}
            name="message"
            className="mt-2"
            placeholder={`Eg: ${label} validation message`}
            onChange={handleChange}
          />
        )}
      </FormField>
    );
  };
};

export const DateFieldIsBefore = createValidationComponentForDate(
  'Is Before',
  'isBefore',
  'Eg: 2023-01-01',
  (v) => v?.length > 0,
);

export const DateFieldIsAfter = createValidationComponentForDate(
  'Is After',
  'isAfter',
  'Eg: 2023-01-01',
  (v) => v?.length > 0,
);

export const DateFieldMatchesFormat = createValidationComponentForDate(
  'Matches Format',
  'matchesFormat',
  'Eg: YYYY-MM-DD',
  (v) => v?.length > 0,
);

export const createBinaryValidationComponentForDate = (
  label: string,
  key: keyof typeof CUSTOM_FIELD_VALIDATIONS.date.binary,
  isRequired: boolean = false,
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value, message } = selectedField?.validation?.custom?.[key] || {};
    const updateSelectedField = debounce(
      useSelectedFieldStore((s) => s.updateSelectedField),
      500,
    );

    const required = useMemo(
      () => ({
        label: value ? 'Yes' : 'No',
        value: value ? 'true' : 'false',
      }),
      [value],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const validationFn = CUSTOM_FIELD_VALIDATIONS.date.binary?.[key](value);

      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [key]: {
              ...selectedField?.validation?.custom?.[key],
              message: value,
              type: 'binary',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [key]: validationFn,
          },
        },
      });
    };

    return (
      <FormField id={key} label={label} required={isRequired} key={selectedField?.id}>
        <Combobox
          options={requiredOptions}
          selectedValues={[required]}
          handleChange={(v) => {
            const validationFn = CUSTOM_FIELD_VALIDATIONS.date.binary?.[key](message || '');
            updateSelectedField({
              validation: {
                ...selectedField?.validation,
                custom: {
                  ...selectedField?.validation?.custom,
                  [key]: {
                    ...selectedField?.validation?.custom?.[key],
                    value: v[0].value === 'true',
                  },
                },
                validate: {
                  ...selectedField?.validation?.validate,
                  [key]: v[0].value === 'true' ? validationFn : () => true,
                },
              },
            });
          }}
        />
        {required?.value === 'true' && (
          <Input
            name="message"
            defaultValue={message}
            onChange={handleChange}
            className="mt-2"
            placeholder={`Eg: ${label} validation message`}
          />
        )}
      </FormField>
    );
  };
};

export const DateFieldRestrictFutureDate = createBinaryValidationComponentForDate(
  'Restrict Future Date',
  'restrictFutureDate',
  true,
);

export const DateFieldRestrictPastDate = createBinaryValidationComponentForDate(
  'Restrict Past Date',
  'restrictPastDate',
  true,
);

export const DateFieldRequired = createBinaryValidationComponentForDate('Required', 'required', true);
