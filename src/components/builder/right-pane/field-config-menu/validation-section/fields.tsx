import FormField from "@/components/common/FormField";
import { Combobox, Option } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
import { CUSTOM_FIELD_VALIDATIONS } from "@/lib/validation";
import { FieldEntity } from "@/types/form-config";
import { useSelectedFieldStore } from "@/zustand/store";
import { useMemo, useState } from "react";

const requiredOptions = [
  {
    label: "Yes",
    value: "true",
  },
  { label: "No", value: "false" },
];

const useSelectedFieldUpdate = () => {
  const updateSelectedField = useSelectedFieldStore(
    (state) => state.updateSelectedField
  );

  const debouncedSelectedFieldUpdate = debounce((property, value) => {
    updateSelectedField({ [property as keyof FieldEntity]: value });
  }, 500);

  const handlePropertyChange =
    (property: keyof FieldEntity) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      debouncedSelectedFieldUpdate(property, value);
    };

  return {
    handlePropertyChange,
    updateSelectedField,
  };
};

const useSelectedField = () => useSelectedFieldStore((s) => s.selectedField);

export const FieldRequired = () => {
  const selectedField = useSelectedField();
  const { value, message } = selectedField?.validation?.required || {};
  const updateSelectedField = debounce(
    useSelectedFieldStore((s) => s.updateSelectedField),
    500
  );

  const required = useMemo(
    () => ({
      label: value ? "Yes" : "No",
      value: value ? "true" : "false",
    }),
    [value]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    updateSelectedField({
      validation: {
        ...selectedField?.validation,
        required: {
          ...selectedField?.validation?.required,
          message: value,
        },
      },
    });
  };

  return (
    <FormField id="required" label="Required" required>
      <Combobox
        options={requiredOptions}
        selectedValues={[required]}
        handleChange={(v) => {
          updateSelectedField({
            validation: {
              ...selectedField?.validation,
              required: {
                ...selectedField?.validation?.required,
                value: v[0]?.value === "true",
              },
            },
          });
        }}
      />
      {required?.value === "true" && (
        <Input
          name="message"
          defaultValue={message}
          onChange={handleChange}
          className="mt-2"
          placeholder="Eg: This field is required"
        />
      )}
    </FormField>
  );
};

export const createValidationComponent = (
  label: string,
  key: keyof typeof CUSTOM_FIELD_VALIDATIONS.text,
  placeholder: string,
  cb: (v: string) => boolean
) => {
  // eslint-disable-next-line react/display-name
  return () => {
    const selectedField = useSelectedField();
    const { value: fieldValidationValue, message: fieldValidationMessage } =
      selectedField?.validation?.custom?.[key] || {};
    const updateSelectedField = useSelectedFieldStore(
      (s) => s.updateSelectedField
    );
    console.log("field value", fieldValidationValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      const validationValue =
        name === "value"
          ? value
          : selectedField?.validation?.custom?.[key]?.value;
      const msg =
        name === "message"
          ? value
          : selectedField?.validation?.custom?.[key]?.message;

      const validationFn = CUSTOM_FIELD_VALIDATIONS.text[key](
        validationValue,
        msg
      );

      const getUpdatedField = (k: string, v: string | number) => ({
        validation: {
          ...selectedField?.validation,
          custom: {
            ...selectedField?.validation?.custom,
            [key]: {
              ...selectedField?.validation?.custom?.[key],
              [k]: v,
            },
          },
          validate: {
            ...selectedField?.validation?.validate,
            [key]: validationFn,
          },
        },
      });

      updateSelectedField(
        getUpdatedField(name, value) as unknown as FieldEntity
      );
    };

    return (
      <FormField id={key} label={label}>
        <Input
          name="value"
          placeholder={placeholder}
          type="text"
          value={fieldValidationValue ?? ""}
          onChange={handleChange}
        />
        {cb(fieldValidationValue) && (
          <Input
            value={fieldValidationMessage}
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

export const FieldExactLength = createValidationComponent(
  "Exact Length",
  "exactLength",
  "Eg: 5",
  (v) => +v > 0
);

export const FieldStartsWith = createValidationComponent(
  "Starts With",
  "startsWith",
  "Eg: Me",
  (v) => v?.length > 0
);

export const FieldEndsWith = createValidationComponent(
  "Ends With",
  "endsWith",
  "Eg: .com",
  (v) => v?.length > 0
);

export const FieldMinLength = createValidationComponent(
  "Minimum Length",
  "minLength",
  "Eg: 5",
  (v) => +v > 0
);

export const FieldMaxLength = createValidationComponent(
  "Maximum Length",
  "maxLength",
  "Eg: 20",
  (v) => +v > 0
);

export const FieldContains = createValidationComponent(
  "Contains",
  "contains",
  "Eg: world",
  (v) => v?.length > 0
);

export const FieldMatchesRegex = createValidationComponent(
  "Matches Regex",
  "matchesRegex",
  "Eg: ^[a-zA-Z0-9]+$",
  (v) => v?.length > 0
);

export const FieldNoWhitespace = createValidationComponent(
  "No Whitespace",
  "noWhitespace",
  "Eg: No spaces allowed",
  () => false
);

export const FieldIsEmail = createValidationComponent(
  "Is Email",
  "isEmail",
  "Eg: Should be an email",
  () => false
);

export const FieldIsURL = createValidationComponent(
  "Is URL",
  "isURL",
  "Eg: Should be a valid url",
  () => false
);

export const FieldIsNumeric = createValidationComponent(
  "Is Numeric",
  "isNumeric",
  "Eg: 12345",
  (v) => v?.length > 0
);

export const FieldIsAlpha = createValidationComponent(
  "Is Alpha",
  "isAlpha",
  "Eg: abcXYZ",
  (v) => v?.length > 0
);

export const FieldIsAlphanumeric = createValidationComponent(
  "Is Alphanumeric",
  "isAlphanumeric",
  "Eg: abc123",
  (v) => v?.length > 0
);

export const FieldNoSpecialCharacters = createValidationComponent(
  "No Special Characters",
  "noSpecialCharacters",
  "Eg: abc123",
  (v) => v?.length > 0
);
