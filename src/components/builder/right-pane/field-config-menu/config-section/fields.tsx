import FormFieldWrapper from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Combobox, Option } from '@/components/ui/combobox';
import { DateTimePicker } from '@/components/ui/datepicker';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn, debounce } from '@/lib/utils';
import { FieldEntity } from '@/types/form-config';
import { useSelectedFieldStore } from '@/zustand/store';
import { Plus, Trash } from 'lucide-react';
import { memo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

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
    <T extends string | number | boolean | Date | string[] | Option[]>(property: keyof FieldEntity) =>
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
    <FormFieldWrapper id="Name" label="Field name" required>
      <Input
        defaultValue={selectedField?.name ?? selectedField?.label?.toLowerCase()?.replaceAll(' ', '-') ?? ''}
        onChange={handlePropertyChange('name')}
      />
    </FormFieldWrapper>
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
    <FormFieldWrapper id="type" label="Field Type" required>
      <Combobox options={types} selectedValues={[selectedFieldTypeOption]} />
    </FormFieldWrapper>
  );
});

FieldType.displayName = 'FieldType';

export const FieldPlaceholder = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="placeholder" label="Field placeholder">
      <Input
        defaultValue={selectedField?.placeholder ?? ''}
        placeholder="Eg: Enter something here..."
        onChange={handlePropertyChange('placeholder')}
      />
    </FormFieldWrapper>
  );
});

FieldPlaceholder.displayName = 'FieldPlaceholder';

export const FieldLabel = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="label" label="Field Label" required>
      <Textarea defaultValue={selectedField?.label ?? ''} onChange={handlePropertyChange('label')} />
    </FormFieldWrapper>
  );
});

FieldLabel.displayName = 'FieldLabel';

export const FieldHelperText = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="helperText" label="Helper Text" required>
      <Textarea defaultValue={selectedField?.label ?? ''} onChange={handlePropertyChange('helperText')} />
    </FormFieldWrapper>
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
    <FormFieldWrapper id="defaultValue" label="Default Value">
      {renderDefaultValueInput()}
    </FormFieldWrapper>
  );
});

FieldDefaultValue.displayName = 'FieldDefaultValue';

const defaultOptions = [{ label: 'Option 1', value: 'option-1' }];

export const FieldOptionsForm = memo(() => {
  const { handlePropertyChangeWithValue } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();
  const form = useForm<{ options: Option[] }>({
    mode: 'onTouched',
    defaultValues: {
      options: selectedField?.options ?? defaultOptions,
    },
  });

  const { fields, append, remove, insert } = useFieldArray({
    name: 'options',
    control: form.control,
  });

  const renderActionButton = (Icon: React.ElementType, title: string, onClick: () => void, className?: string) => {
    return (
      <span
        tabIndex={0}
        title={title}
        aria-label={title}
        aria-roledescription={title}
        role="button"
        className={cn('cursor-pointer bg-white text-black rounded-full h-full p-1 inline-block', className)}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
      >
        <Icon className="w-4 h-4" />
      </span>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <FormFieldWrapper id="options" label="Options" required className="flex flex-col gap-3">
          {fields?.map((field, index) => (
            <div className="flex items-start gap-3 mb-3" key={field.id}>
              <FormField
                control={form.control}
                name={`options.${index}.label`}
                rules={{
                  required: 'Label is required',
                }}
                render={({ field: rhfField }) => (
                  <FormControl>
                    <div className="flex flex-col gap-2 space-x-2">
                      <Input {...rhfField} />
                      <FormMessage />
                    </div>
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name={`options.${index}.value`}
                rules={{
                  required: 'Label is required',
                }}
                render={({ field: rhfField }) => (
                  <FormControl>
                    <div className="flex flex-col gap-2 space-x-2">
                      <Input {...rhfField} value={rhfField.value as string} />
                      <FormMessage />
                    </div>
                  </FormControl>
                )}
              />
              {renderActionButton(
                Plus,
                'Add Option',
                () => insert(index + 1, defaultOptions[0]),
                cn('self-center', form.formState.errors?.options?.[index] && 'self-start mt-1'),
              )}
              {renderActionButton(
                Trash,
                'Remove Option',
                () => remove(index),
                cn('bg-red-500 text-white self-center', form.formState.errors?.options?.[index] && 'self-start mt-1'),
              )}
            </div>
          ))}
          {fields?.length === 0 && <div className="flex items-center gap-3 ">No Options</div>}
          <Button type="submit" variant="default" onClick={() => append(defaultOptions[0])}>
            Add Option
          </Button>
          <Button
            type="submit"
            variant="secondary"
            onClick={() => handlePropertyChangeWithValue('options')(form.getValues('options'))}
          >
            Save Changes
          </Button>
        </FormFieldWrapper>
      </form>
    </Form>
  );
});

FieldOptionsForm.displayName = 'FieldOptions';
