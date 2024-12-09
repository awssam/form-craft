import FormFieldWrapper from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Combobox, Option } from '@/components/ui/combobox';
import CustomTooltip from '@/components/ui/custom-tooltip';
import { DateTimePicker } from '@/components/ui/datepicker';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { convertFieldType, Field_Type_Options } from '@/lib/form';
import { cn, debounce } from '@/lib/utils';
import { FieldEntity, FieldType as AvailableFieldTypes } from '@/types/form-config';
import { useSelectedFieldStore } from '@/zustand/store';
import { isValid } from '@/lib/datetime';
import { Plus, Trash } from 'lucide-react';
import React, { memo } from 'react';
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
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="Name" label="Field Name">
      <Input
        defaultValue={selectedField?.name ?? selectedField?.label?.toLowerCase()?.replaceAll(' ', '-') ?? ''}
        readOnly
        disabled
      />
    </FormFieldWrapper>
  );
});
FieldName.displayName = 'FieldName';

export const FieldType = memo(() => {
  const selectedField = useSelectedField();
  const updateSelectedField = useSelectedFieldStore((state) => state.updateSelectedField);
  const [selectedFieldTypeOption, setSelectedFieldTypeOption] = React.useState<Option>(() => {
    return Field_Type_Options.find((option) => option.value === selectedField?.type) ?? Field_Type_Options[0];
  });

  const handleUpdateType = (v: Option[]) => {
    setSelectedFieldTypeOption(v[0]);
    const newField = convertFieldType(selectedField!, v[0].value as AvailableFieldTypes);

    updateSelectedField(newField);
  };

  return (
    <FormFieldWrapper
      id="type"
      label="Field Type"
      required
      helperText="Conversion of types will reset field specific settings"
    >
      <Combobox
        options={Field_Type_Options}
        selectedValues={[selectedFieldTypeOption]}
        handleChange={handleUpdateType}
      />
    </FormFieldWrapper>
  );
});

FieldType.displayName = 'FieldType';

export const FieldPlaceholder = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="placeholder" label="Field Placeholder" helperText="A hint for what to enter in the field">
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
    <FormFieldWrapper id="label" label="Field Label" required helperText="What the field is called?">
      <Textarea defaultValue={selectedField?.label ?? ''} onChange={handlePropertyChange('label')} />
    </FormFieldWrapper>
  );
});

FieldLabel.displayName = 'FieldLabel';

export const FieldHelperText = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  return (
    <FormFieldWrapper id="helperText" label="Helper Text" helperText="Any additional helper text for the field">
      <Textarea defaultValue={selectedField?.helperText ?? ''} onChange={handlePropertyChange('helperText')} />
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
            value={isValid(selectedField?.defaultValue) ? new Date(selectedField?.defaultValue as string) : undefined}
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
      case 'dropdown':
        return (
          <Combobox
            allowMultiple
            options={selectedField?.options as Option[]}
            selectedValues={
              (selectedField?.options as Option[]).filter((option) =>
                (selectedField?.defaultValue as string[])?.includes(option?.value as string),
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
    <FormFieldWrapper
      id="defaultValue"
      label="Pre Filled Value"
      helperText="Use this to pre fill the field with a default value"
    >
      {renderDefaultValueInput()}
    </FormFieldWrapper>
  );
});

FieldDefaultValue.displayName = 'FieldDefaultValue';

const widthOptions = [
  { label: '1/4 Quarter Width', value: '25%' },
  { label: 'Half Width', value: '50%' },
  { label: '3/4 Quarter Width', value: '75%' },
  { label: 'Full Width', value: '100%' },
];

export const FieldWidth = memo(() => {
  const { handlePropertyChangeWithValue } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();

  const getSelectedOption = () => {
    return widthOptions?.find((option) => option?.value === selectedField?.width) ?? widthOptions[0];
  };

  return (
    <FormFieldWrapper
      id="width"
      label="Field Width"
      required
      helperText="The width of the field (Responsive by default)"
    >
      <Combobox
        options={widthOptions}
        selectedValues={[getSelectedOption()]}
        handleChange={(values) => handlePropertyChangeWithValue('width')(values?.[0]?.value as string)}
      />
    </FormFieldWrapper>
  );
});

FieldWidth.displayName = 'FieldWidth';

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
      <CustomTooltip tooltip={title} className={className}>
        <span
          tabIndex={0}
          aria-label={title}
          aria-roledescription={title}
          role="button"
          className={cn('cursor-pointer bg-white text-black rounded-full h-full p-1 inline-block', className)}
          onClick={onClick}
          onKeyDown={(e) => e.key === 'Enter' && onClick()}
        >
          <Icon className="w-4 h-4" />
        </span>
      </CustomTooltip>
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
                      <Input {...rhfField} value={rhfField.value as string} placeholder='Label e.g "Option 1"' />
                      <FormMessage />
                    </div>
                  </FormControl>
                )}
              />
              <FormField
                control={form.control}
                name={`options.${index}.value`}
                rules={{
                  required: 'Value is required',
                }}
                render={({ field: rhfField }) => (
                  <FormControl>
                    <div className="flex flex-col gap-2 space-x-2">
                      <Input {...rhfField} value={rhfField.value as string} placeholder='Value e.g "option-1' />
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
