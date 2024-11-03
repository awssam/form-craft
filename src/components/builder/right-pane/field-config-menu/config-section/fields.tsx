import FormField from "@/components/common/FormField";
import { Combobox, Option } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { debounce } from "@/lib/utils";
import { FieldEntity } from "@/types/form-config";
import { useSelectedFieldStore } from "@/zustand/store";
import { memo } from "react";

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

export const FieldName = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="Name" label="Field name" required>
      <Input
        defaultValue={
          selectedField?.name ??
          selectedField?.label?.toLowerCase()?.replaceAll(" ", "-") ??
          ""
        }
        onChange={handlePropertyChange("name")}
      />
    </FormField>
  );
});
FieldName.displayName = "FieldName";

const types = [
  "text",
  "date",
  "radio",
  "checkbox",
  "dropdown",
  "file",
  "textarea",
]?.map((type) => ({
  label: type?.replace(type?.charAt(0), type?.charAt(0)?.toUpperCase()),
  value: type,
}));

export const FieldType = memo(() => {
  const selectedField = useSelectedField();

  const selectedFieldTypeOption = types?.find(
    (type) => type?.value === selectedField?.type
  ) as Option;
  return (
    <FormField id="type" label="Field Type" required>
      <Combobox options={types} selectedValues={[selectedFieldTypeOption]} />
    </FormField>
  );
});

FieldType.displayName = "FieldType";

export const FieldPlaceholder = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="placeholder" label="Field placeholder">
      <Input
        defaultValue={selectedField?.placeholder ?? ""}
        placeholder="Eg: Enter something here..."
        onChange={handlePropertyChange("placeholder")}
      />
    </FormField>
  );
});

FieldPlaceholder.displayName = "FieldPlaceholder";

export const FieldLabel = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="label" label="Field Label" required>
      <Textarea
        defaultValue={selectedField?.label ?? ""}
        onChange={handlePropertyChange("label")}
      />
    </FormField>
  );
});

FieldLabel.displayName = "FieldLabel";

export const FieldHelperText = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="helperText" label="Helper Text" required>
      <Textarea
        defaultValue={selectedField?.label ?? ""}
        onChange={handlePropertyChange("label")}
      />
    </FormField>
  );
});
FieldHelperText.displayName = "FieldHelperText";
