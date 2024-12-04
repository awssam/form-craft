import FormField from '@/components/common/FormField';
import { Combobox } from '@/components/ui/combobox';
import { DateTimePicker } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { debounce } from '@/lib/utils';
import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { FieldEntity, FieldType } from '@/types/form-config';
import { useSelectedFieldStore } from '@/zustand/store';
import { ComponentProps, useMemo } from 'react';

const requiredOptions = [
  {
    label: 'Yes',
    value: 'true',
  },
  { label: 'No', value: 'false' },
];

const useSelectedField = () => useSelectedFieldStore((s) => s.selectedField);

interface CreateGenericSingleValueValidationComponentProps {
  label: string;
  fieldType: FieldType;
  validatorKey: string;
  placeholder: string;
  cb: (v: string) => boolean;
  helperText?: string;
  inputType?: ComponentProps<'input'>['type'];
  renderer?: (props: {
    fieldValidationValue: string | undefined;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => JSX.Element; // Renderer now only affects the input slot
}

export const createGenericSingleValueValidationComponent = ({
  label,
  fieldType,
  validatorKey,
  placeholder,
  cb,
  inputType,
  helperText,
  renderer, // Accept renderer as a parameter
}: CreateGenericSingleValueValidationComponentProps) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value: fieldValidationValue, message: fieldValidationMessage } =
      selectedField?.validation?.custom?.[validatorKey] || {};
    const updateSelectedField = debounce(
      useSelectedFieldStore((s) => s.updateSelectedField),
      500,
    );

    const getValidationFn = <T extends string | number>(value: T, message: string) => {
      const validationMap = CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS];
      const functor = validationMap?.withValue?.[validatorKey as keyof typeof validationMap.withValue] as (
        value: T,
        message: string,
        selectedField: FieldEntity | null,
      ) => (val: string) => boolean | string;
      const validationFn = functor ? functor(value, message, selectedField) : () => true;
      return validationFn;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const validationValue = name === 'value' ? value : selectedField?.validation?.custom?.[validatorKey]?.value;
      const msg = name === 'message' ? value : selectedField?.validation?.custom?.[validatorKey]?.message;

      const validationFn = getValidationFn<string>(validationValue, msg as string);

      const getUpdatedField = (k: string, v: string | number) => ({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [validatorKey]: {
              ...selectedField?.validation?.custom?.[validatorKey],
              [k]: v,
              type: 'withValue',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [validatorKey]: k === 'value' ? (value?.length > 0 ? validationFn : () => true) : validationFn,
          },
        },
      });

      updateSelectedField(getUpdatedField(name, value) as unknown as FieldEntity);
    };

    return (
      <FormField id={validatorKey} label={label} key={selectedField?.id} helperText={helperText}>
        {renderer ? (
          renderer({
            fieldValidationValue,
            handleChange,
            placeholder,
          })
        ) : (
          <Input
            name="value"
            placeholder={placeholder}
            defaultValue={fieldValidationValue ?? ''}
            onChange={handleChange}
            type={inputType ?? 'text'}
            min={inputType === 'number' ? 0 : undefined}
          />
        )}
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

interface CreateGenericBinaryValidationComponentProps {
  label: string;
  fieldType: FieldType;
  validatorKey: string;
  isRequired?: boolean;
  helperText?: string;
}

export const createGenericBinaryValidationComponent = ({
  label,
  fieldType,
  validatorKey,
  isRequired,
  helperText,
}: CreateGenericBinaryValidationComponentProps) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value, message } = selectedField?.validation?.custom?.[validatorKey] || {};
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

    const getValidationFn = (message: string) => {
      const validationMap = CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS];
      const functor = validationMap?.binary?.[validatorKey as keyof typeof validationMap.binary];
      const validationFn = functor ? functor(message) : () => true;
      return validationFn;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const validationFn = getValidationFn(value);

      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [validatorKey]: {
              ...selectedField?.validation?.custom?.[validatorKey],
              message: value,
              type: 'binary',
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [validatorKey]: validationFn,
          },
        },
      });
    };

    return (
      <FormField id={validatorKey} label={label} required={isRequired} key={selectedField?.id} helperText={helperText}>
        <Combobox
          options={requiredOptions}
          selectedValues={[required]}
          handleChange={(v) => {
            const validationFn = getValidationFn(message || '');
            updateSelectedField({
              validation: {
                ...selectedField?.validation,
                custom: {
                  ...selectedField?.validation?.custom,
                  [validatorKey]: {
                    ...selectedField?.validation?.custom?.[validatorKey],
                    value: v[0].value === 'true',
                  },
                },
                validate: {
                  ...selectedField?.validation?.validate,
                  [validatorKey]: v[0].value === 'true' ? validationFn : () => true,
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

// Text field validations

export const FieldExactLength = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'exactLength',
  label: 'Exact Length',
  placeholder: 'Eg: 5',
  cb: (v) => +v > 0,
  inputType: 'number',
  helperText: 'Input must be exactly this number of characters.',
});

export const FieldStartsWith = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'startsWith',
  label: 'Starts With',
  placeholder: 'Eg: Me',
  cb: (v) => v?.length > 0,
  inputType: 'text',
  helperText: 'Input should begin with this text.',
});

export const FieldEndsWith = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'endsWith',
  label: 'Ends With',
  placeholder: 'Eg: .com',
  cb: (v) => v?.length > 0,
  inputType: 'text',
  helperText: 'Input must end with this text.',
});

export const FieldMinLength = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'minLength',
  label: 'Minimum Length',
  placeholder: 'Eg: 5',
  cb: (v) => +v > 0,
  inputType: 'number',
  helperText: 'Input must have at least this many characters.',
});

export const FieldMaxLength = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'maxLength',
  label: 'Maximum Length',
  placeholder: 'Eg: 20',
  cb: (v) => +v > 0,
  inputType: 'number',
  helperText: 'Input cannot exceed this number of characters.',
});

export const FieldContains = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'contains',
  label: 'Contains',
  placeholder: 'Eg: world',
  cb: (v) => v?.length > 0,
  inputType: 'text',
  helperText: 'Input must include this text anywhere.',
});

export const FieldMatchesRegex = createGenericSingleValueValidationComponent({
  fieldType: 'text',
  validatorKey: 'matchesRegex',
  label: 'Matches Regex',
  placeholder: 'Eg: ^[a-zA-Z0-9]+$',
  cb: (v) => v?.length > 0,
  helperText: 'Input must match this regular expression pattern.',
});

// Binary field validations

export const FieldRequired = createGenericBinaryValidationComponent({
  label: 'Required',
  fieldType: 'text',
  validatorKey: 'required',
  isRequired: true,
  helperText: 'If Yes, this field must be filled out.',
});

export const FieldNoWhitespace = createGenericBinaryValidationComponent({
  label: 'No Whitespace',
  fieldType: 'text',
  validatorKey: 'noWhitespace',
  helperText: 'If Yes, input cannot contain any spaces.',
});

export const FieldIsEmail = createGenericBinaryValidationComponent({
  label: 'Is Email',
  fieldType: 'text',
  validatorKey: 'isEmail',
  helperText: 'If Yes, input must be a valid email address.',
});

export const FieldIsURL = createGenericBinaryValidationComponent({
  label: 'Is URL',
  fieldType: 'text',
  validatorKey: 'isURL',
  helperText: 'If Yes, input must be a valid URL.',
});

export const FieldIsNumeric = createGenericBinaryValidationComponent({
  label: 'Is Numeric',
  fieldType: 'text',
  validatorKey: 'isNumeric',
  helperText: 'If Yes, input must contain only numbers.',
});

export const FieldIsAlpha = createGenericBinaryValidationComponent({
  label: 'Is Alpha',
  fieldType: 'text',
  validatorKey: 'isAlpha',
  helperText: 'If Yes, input must contain only letters.',
});

export const FieldIsAlphanumeric = createGenericBinaryValidationComponent({
  label: 'Is Alphanumeric',
  fieldType: 'text',
  validatorKey: 'isAlphanumeric',
  helperText: 'If Yes, input must contain only letters and numbers.',
});

export const FieldNoSpecialCharacters = createGenericBinaryValidationComponent({
  label: 'No Special Characters',
  fieldType: 'text',
  validatorKey: 'noSpecialCharacters',
  helperText: 'If Yes, input cannot include special characters.',
});

// Date type Fields

export const createSingleValueValidationComponentForDate = (
  label: string,
  key: keyof typeof CUSTOM_FIELD_VALIDATIONS.date.withValue,
  placeholder: string,
  cb: (v: string) => boolean,
  helperText?: string,
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    // Use the generic single value validation component
    return createGenericSingleValueValidationComponent({
      label,
      fieldType: 'date',
      validatorKey: key,
      placeholder,
      cb, // Pass through the callback for validation
      helperText,
      renderer: ({ fieldValidationValue, handleChange, placeholder }) => (
        <DateTimePicker
          granularity="day"
          placeholder={placeholder}
          value={fieldValidationValue ? new Date(fieldValidationValue) : undefined}
          onChange={(date: Date | undefined) => {
            handleChange({
              target: { name: 'value', value: date?.toISOString() },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
          }}
        />
      ),
    })();
  };
};

export const DateFieldIsBefore = createSingleValueValidationComponentForDate(
  'Is Before',
  'isBefore',
  'Eg: 2023-01-01',
  (v) => v?.toString()?.length > 0,
  'The date must be before this specified date.',
);

export const DateFieldIsAfter = createSingleValueValidationComponentForDate(
  'Is After',
  'isAfter',
  'Eg: 2023-01-01',
  (v) => v?.toString()?.length > 0,
  'The date must be after this specified date.',
);

export const DateFieldMatchesFormat = createSingleValueValidationComponentForDate(
  'Matches Format',
  'matchesFormat',
  'Eg: YYYY-MM-DD',
  (v) => v?.toString()?.length > 0,
  'The date must match this format.',
);

export const DateFieldRestrictFutureDate = createGenericBinaryValidationComponent({
  label: 'Restrict Future Date',
  fieldType: 'date',
  validatorKey: 'restrictFutureDate',
  isRequired: true,
  helperText: 'If Yes, future dates are not allowed.',
});

export const DateFieldRestrictPastDate = createGenericBinaryValidationComponent({
  label: 'Restrict Past Date',
  fieldType: 'date',
  validatorKey: 'restrictPastDate',
  isRequired: true,
  helperText: 'If Yes, past dates are not allowed.',
});

export const DateFieldRequired = createGenericBinaryValidationComponent({
  label: 'Required',
  fieldType: 'date',
  validatorKey: 'required',
  isRequired: true,
  helperText: 'If Yes, this field must be filled out.',
});

// Checkbox type Fields

export const CheckboxFieldRequired = createGenericBinaryValidationComponent({
  label: 'Required',
  fieldType: 'checkbox',
  validatorKey: 'required',
  isRequired: true,
  helperText: 'If Yes, at least one checkbox must be selected.',
});

export const CheckboxFieldMinCount = createGenericSingleValueValidationComponent({
  label: 'Min Count',
  fieldType: 'checkbox',
  validatorKey: 'minCount',
  placeholder: 'Eg: 2',
  cb: (v) => +v > 0,
  inputType: 'number',
  helperText: 'Minimum number of checkboxes that must be selected.',
});

export const CheckboxFieldMaxCount = createGenericSingleValueValidationComponent({
  label: 'Max Count',
  fieldType: 'checkbox',
  validatorKey: 'maxCount',
  placeholder: 'Eg: 2',
  cb: (v) => +v > 0,
  inputType: 'number',
  helperText: 'Maximum number of checkboxes that can be selected.',
});
