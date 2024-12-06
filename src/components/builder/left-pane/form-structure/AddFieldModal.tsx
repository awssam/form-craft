import FormFieldWrapper from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { Combobox, Option } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useFormSectionDisplay from '@/hooks/useFormSectionDisplay';
import { createNewFormField, Field_Type_Options } from '@/lib/form';
import { FieldType } from '@/types/form-config';
import { useFormActionProperty, useFormProperty, useSelectedFieldStore } from '@/zustand/store';
import { DialogDescription } from '@radix-ui/react-dialog';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';

type NewFieldFormData = {
  fieldName: string;
  fieldLabel: string;
};

const AddFieldModal = () => {
  const fieldEntities = useFormProperty('fieldEntities');

  const addFormField = useFormActionProperty('addField');
  const pages = useFormProperty('pages');

  const setSelectedField = useSelectedFieldStore((s) => s.setSelectedField);

  const { FORMSECTIONS, setSection } = useFormSectionDisplay();

  const [open, setOpen] = React.useState(false);
  const [fieldType, setFieldType] = React.useState<Option>(Field_Type_Options[0]);

  const nameSet = useMemo(
    () => new Set(Object.values(fieldEntities || {}).map((field) => field.name)),
    [fieldEntities],
  );

  const form = useForm<NewFieldFormData>({
    defaultValues: {
      fieldName: '',
      fieldLabel: '',
    },
    mode: 'onTouched',
  });

  const handleFieldAdd = (data: NewFieldFormData) => {
    const newField = createNewFormField({
      type: fieldType.value as FieldType,
      name: data.fieldName,
      label: data.fieldLabel,
    });

    const firstPageId = pages?.[0];

    if (firstPageId) {
      addFormField(firstPageId, newField);
    }

    setSelectedField(newField);
    setSection(FORMSECTIONS.Settings);

    setOpen(false);
  };

  const validations = {
    fieldName: {
      required: 'Field Name is required',
      validate: {
        uniqueName: (value: string) => {
          return !nameSet.has(value) || 'Field Name must be unique';
        },
      },
    },
    fieldLabel: {
      required: 'Field Label is required',
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 hover:bg-zinc-800 w-full text-foreground transition-colors" id="addField">
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Field</DialogTitle>
          <DialogDescription className="sr-only">Add a new field to the form</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFieldAdd)} className="space-y-8">
            <FormField
              control={form.control}
              name="fieldName"
              rules={validations.fieldName}
              render={({ field }) => (
                <FormFieldWrapper label="Field Name" id="fieldName" helperText="This must be an unique value">
                  <Input type="text" placeholder="Field Name" {...field} className="mb-2" />
                  <FormMessage />
                </FormFieldWrapper>
              )}
            />

            <FormFieldWrapper label="Field Type" id="fieldType" helperText="Choose an appropriate field type">
              <Combobox
                options={Field_Type_Options}
                selectedValues={[fieldType]}
                handleChange={(values) => setFieldType(values[0])}
              />
            </FormFieldWrapper>

            <FormField
              control={form.control}
              name="fieldLabel"
              rules={validations.fieldLabel}
              render={({ field }) => (
                <FormFieldWrapper label="Field Label" id="fieldLabel" helperText="What is this field called?">
                  <Input type="text" placeholder="Field Label" {...field} className="mb-2" />
                  <FormMessage />
                </FormFieldWrapper>
              )}
            />

            <DialogFooter>
              <Button type="submit">Submit</Button>
              <Button type="reset" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFieldModal;
