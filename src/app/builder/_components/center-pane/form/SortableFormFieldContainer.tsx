import { Fragment, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import FieldRenderer from './FieldRenderer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { useFieldVisibilityStore, useFormProperty } from '@/zustand/store';
import useFieldUnregister from '@/hooks/useFieldUnregister';
import usePopulateFieldValidation from '@/hooks/usePopulateFieldValidation';

import { FieldEntity } from '@/types/form-config';
import useFieldConditionalLogicCheck from '@/hooks/useFieldConditionalLogicCheck';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DragOverlay } from '@dnd-kit/core';

export interface FormFieldsProps {
  pageId: string;
  isLastPage: boolean;
  activeField: FieldEntity | null;
}

const SortableFormFieldContainer = ({ pageId, isLastPage, activeField }: FormFieldsProps) => {
  const fieldEntities = useFormProperty('fieldEntities');
  const pageEntities = useFormProperty('pageEntities');
  const fontFamily = useFormProperty("styles")?.fontFamily || "Poppins";


  const setFieldVisibility = useFieldVisibilityStore((s) => s.setFieldVisibility);

  const fields = useMemo(() => pageEntities?.[pageId]?.fields, [pageEntities, pageId]);
  const form = useForm({});

  // unregister fields that are no longer in the form - this is important for multipage forms with drag and drop
  useFieldUnregister(pageId, form);

  // for all fields populate the validation functions from the client validation map
  usePopulateFieldValidation(pageId);

  // validate conditional logic for all fields
  useFieldConditionalLogicCheck(fields!, fieldEntities, setFieldVisibility);

  return (
    <SortableContext id={pageId} items={fields!} strategy={verticalListSortingStrategy}>
      <Form {...form}>
        <form
          className="w-full transition-all duration-200 ease-in-out"
          onSubmit={form.handleSubmit(
            (data) => console.log(data),
            (errors) => console.log(JSON.stringify(errors, null, 2)),
          )}
          style={{fontFamily, letterSpacing:'normal !important'}}
        >
          <div className="flex flex-wrap w-full overflow-clip transition-all duration-200 ease-in-out [column-gap:0.5rem]">
            {fields?.map((fieldId) => (
              <Fragment key={fieldId}>
                <FieldRenderer control={form.control} field={fieldEntities?.[fieldId] as FieldEntity} />
              </Fragment>
            ))}
          </div>

          {fields?.length === 0 && (
            <div className="flex justify-center items-center mt-7 w-full h-full">
              <h2 className="font-semibold text-muted-foreground text-xl">No fields found</h2>
            </div>
          )}

          {fields && fields?.length > 0 && (
            <Button className="mt-8 ml-2" type="submit">
              {isLastPage ? 'Submit' : 'Next'}
            </Button>
          )}

          {activeField?.id && (
            <DragOverlay>
              <FieldRenderer control={form.control} field={activeField as FieldEntity} isOverlay />
            </DragOverlay>
          )}
        </form>
      </Form>
    </SortableContext>
  );
};

export default SortableFormFieldContainer;
