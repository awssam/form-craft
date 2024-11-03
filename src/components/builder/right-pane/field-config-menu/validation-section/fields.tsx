import FormField from "@/components/common/FormField";
import { Combobox, Option } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";
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

export const FieldMinLength = () => {
  const selectedField = useSelectedField();
  const { value, message } = selectedField?.validation?.minLength || {};
  const updateSelectedField = debounce(
    useSelectedFieldStore((s) => s.updateSelectedField),
    500
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "value") {
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          minLength: {
            ...selectedField?.validation?.minLength,
            value,
          },
        },
      });
    }

    if (name === "message") {
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          minLength: {
            ...selectedField?.validation?.minLength,
            message: value,
          },
        },
      });
    }
  };

  return (
    <FormField id="minLength" label="Minimum Length">
      <Input
        name="value"
        placeholder="Eg: 2"
        defaultValue={value ?? ""}
        type="number"
        min={0}
        onChange={handleChange}
      />
      {value! > 0 && (
        <Input
          defaultValue={message}
          name="message"
          className="mt-2"
          placeholder="Eg: Should contain atleast 2 chars."
          onChange={handleChange}
        />
      )}
    </FormField>
  );
};

export const FieldMaxLength = () => {
  const selectedField = useSelectedField();
  const { value, message } = selectedField?.validation?.maxLength || {};
  const updateSelectedField = debounce(
    useSelectedFieldStore((s) => s.updateSelectedField),
    500
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "value") {
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          maxLength: {
            ...selectedField?.validation?.maxLength,
            value,
          },
        },
      });
    }

    if (name === "message") {
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          maxLength: {
            ...selectedField?.validation?.maxLength,
            message: value,
          },
        },
      });
    }
  };

  return (
    <FormField id="maxLength" label="Maximum Length">
      <Input
        name="value"
        placeholder="Eg: 20"
        type="number"
        min={0}
        defaultValue={value ?? ""}
        onChange={handleChange}
      />
      {value! > 0 && (
        <Input
          defaultValue={message}
          name="message"
          className="mt-2"
          placeholder="Eg: Can't exceed 20 chars."
          onChange={handleChange}
        />
      )}
    </FormField>
  );
};

export const FieldPattern = () => {
  const selectedField = useSelectedField();
  const { value, message } = selectedField?.validation?.pattern || {};
  const updateSelectedField = debounce(
    useSelectedFieldStore((s) => s.updateSelectedField),
    500
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "value") {
      const regex = new RegExp(value);
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          pattern: {
            ...selectedField?.validation?.pattern,
            value: regex,
          },
        },
      });
    }

    if (name === "message") {
      updateSelectedField({
        validation: {
          ...selectedField?.validation,
          pattern: {
            ...selectedField?.validation?.pattern,
            message: value,
          },
        },
      });
    }
  };

  return (
    <FormField id="pattern" label="Regex Pattern">
      <Input
        name="value"
        defaultValue={JSON.stringify(value) ?? ""}
        onChange={handleChange}
        placeholder="e.g., /^[a-zA-Z0-9]+$/ (only alphanumeric characters)"
      />
      {JSON.stringify(value)?.trim()?.length > 0 && (
        <Input
          defaultValue={message}
          name="message"
          className="mt-2"
          placeholder="Eg: Field should have only alphanumeric characters."
          onChange={handleChange}
        />
      )}
    </FormField>
  );
};
