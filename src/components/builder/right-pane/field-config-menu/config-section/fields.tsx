import FormField from '@/components/common/FormField';
import { Combobox, Option } from '@/components/ui/combobox';
import { DateTimePicker } from '@/components/ui/datepicker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { debounce } from '@/lib/utils';
import { FieldEntity } from '@/types/form-config';
import { useSelectedFieldStore } from '@/zustand/store';
import { memo } from 'react';

const useSelectedFieldUpdate = () => {
  const updateSelectedField = useSelectedFieldStore((state) => state.updateSelectedField);

  const debouncedSelectedFieldUpdate = debounce((property, value) => {
    updateSelectedField({ [property as keyof FieldEntity]: value });
  }, 500);

  const handlePropertyChange =
    (property: keyof FieldEntity) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      debouncedSelectedFieldUpdate(property, value);
    };

  const handlePropertyChangeWithValue =
    <T extends string | number | boolean | Date | string[]>(property: keyof FieldEntity) =>
    (value: T) => {
      debouncedSelectedFieldUpdate(property, value);
    };

  return {
    handlePropertyChange,
    handlePropertyChangeWithValue,
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
        defaultValue={selectedField?.name ?? selectedField?.label?.toLowerCase()?.replaceAll(' ', '-') ?? ''}
        onChange={handlePropertyChange('name')}
      />
    </FormField>
  );
});
FieldName.displayName = 'FieldName';

const types = [
  'text',
  'date',
  'radio',
  'checkbox',
  // "dropdown",
  // "file",
  'textarea',
]?.map((type) => ({
  label: type?.replace(type?.charAt(0), type?.charAt(0)?.toUpperCase()),
  value: type,
}));

export const FieldType = memo(() => {
  const selectedField = useSelectedField();

  const selectedFieldTypeOption = types?.find((type) => type?.value === selectedField?.type) as Option;
  return (
    <FormField id="type" label="Field Type" required>
      <Combobox options={types} selectedValues={[selectedFieldTypeOption]} />
    </FormField>
  );
});

FieldType.displayName = 'FieldType';

export const FieldPlaceholder = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="placeholder" label="Field placeholder">
      <Input
        defaultValue={selectedField?.placeholder ?? ''}
        placeholder="Eg: Enter something here..."
        onChange={handlePropertyChange('placeholder')}
      />
    </FormField>
  );
});

FieldPlaceholder.displayName = 'FieldPlaceholder';

export const FieldLabel = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="label" label="Field Label" required>
      <Textarea defaultValue={selectedField?.label ?? ''} onChange={handlePropertyChange('label')} />
    </FormField>
  );
});

FieldLabel.displayName = 'FieldLabel';

export const FieldHelperText = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormField id="helperText" label="Helper Text" required>
      <Textarea defaultValue={selectedField?.label ?? ''} onChange={handlePropertyChange('helperText')} />
    </FormField>
  );
});
FieldHelperText.displayName = 'FieldHelperText';

export const FieldDefaultValue = memo(() => {
  const { handlePropertyChange, handlePropertyChangeWithValue } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  const renderDefaultValueInput = () => {
    switch (selectedField?.type) {
      case 'text':
        return (
          <Input
            defaultValue={(selectedField?.defaultValue as string) ?? ''}
            onChange={handlePropertyChange('defaultValue')}
          />
        );
      case 'textarea':
        return (
          <Textarea
            defaultValue={(selectedField?.defaultValue as string) ?? ''}
            onChange={handlePropertyChange('defaultValue')}
          />
        );
      case 'date':
        return (
          <DateTimePicker
            granularity="day"
            value={new Date(selectedField?.defaultValue as string)}
            onChange={(date) => handlePropertyChangeWithValue('defaultValue')(date!)}
          />
        );

      case 'radio':
        return (
          <Combobox
            options={selectedField?.options as Option[]}
            selectedValues={
              [selectedField?.options?.find((option) => option?.value === selectedField?.defaultValue)] as Option[]
            }
            handleChange={(options) => {
              const selectedOption = options?.[0];
              handlePropertyChangeWithValue('defaultValue')(selectedOption?.value as string);
            }}
          />
        );
      case 'checkbox':
        return (
          <Combobox
            allowMultiple
            options={selectedField?.options as Option[]}
            selectedValues={
              (selectedField?.options as Option[]).filter((option) =>
                (selectedField?.defaultValue as string[]).includes(option?.value as string),
              ) as Option[]
            }
            handleChange={(options) => {
              const optionValues = options?.map((option) => option?.value) as string[];
              handlePropertyChangeWithValue('defaultValue')(optionValues);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormField id="defaultValue" label="Default Value">
      {renderDefaultValueInput()}
    </FormField>
  );
});

FieldDefaultValue.displayName = 'FieldDefaultValue';
