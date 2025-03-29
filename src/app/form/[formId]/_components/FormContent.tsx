'use client';

import React, { useMemo } from 'react';
import { FieldValues, useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';

import useDebounceEffect from '@/hooks/useDebounceEffect';

import FieldRenderer from './fields/FieldRenderer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import type { FormProps } from './Form';
import type { FieldEntity, PageEntity } from '@/types/form-config';

interface FormContentProps extends FormProps {
  activePageId: string;
  formValuesByPageMap: Record<string, FieldValues>;
  fieldVisibilityMap: Record<string, boolean>;
  isFormSubmitting: boolean;
  onActivePageIdChange: (pageId: string) => void;
  onFormSubmit: (data: FieldValues) => void;
  onPageFieldChange: React.Dispatch<React.SetStateAction<Record<string, FieldEntity>>>;
  onFormValueChange: React.Dispatch<React.SetStateAction<Record<string, Record<string, unknown>>>>;
}

const FormPageName = ({ name, color }: { name: string; color: string }) => {
  if (!name) return null;
  return (
    <h3
      className="pl-2 font-bold text-[14px] sm:text-[16px] border-b border-b-transparent cursor-pointer min-w-12 min-h-6 mt-1"
      style={{ color }}
    >
      {name}
    </h3>
  );
};

const FormContent = ({
  formConfig,
  activePageId,
  formValuesByPageMap,
  fieldVisibilityMap,
  isFormSubmitting,
  onActivePageIdChange,
  onFormSubmit,
  onPageFieldChange,
  onFormValueChange,
}: FormContentProps) => {
  const activePage = formConfig?.pageEntities?.[activePageId] || formConfig?.pageEntities?.[formConfig?.pages?.[0]];
  const form = useForm({
    defaultValues: {
      ...formValuesByPageMap?.[activePageId],
    },
  });

  const [shouldDisableActions, setShouldDisableActions] = React.useState(false);

  const formValues = useWatch({ control: form.control });

  const fieldEntitiesWithNameKeys = useMemo(() => {
    return Object.values(formConfig?.fieldEntities)?.reduce((acc, field) => {
      acc[field?.name] = field;
      return acc;
    }, {} as { [key: string]: FieldEntity });
  }, [formConfig?.fieldEntities]);

  useDebounceEffect(
    React.useCallback(() => {
      onPageFieldChange?.((prev) => {
        const newFields = { ...prev };
        Object.entries(formValues).forEach(([key, value]) => {
          const field = fieldEntitiesWithNameKeys?.[key];
          const fieldId = field?.id;
          newFields[fieldId] = { ...newFields[fieldId], value };
        });
        return newFields;
      });
    }, [fieldEntitiesWithNameKeys, formValues, onPageFieldChange]),
    2000,
  );

  useDebounceEffect(
    React.useCallback(() => {
      onFormValueChange?.((prev) => {
        const newValues = { ...prev };
        newValues[activePageId] = formValues;
        return newValues;
      });
    }, [activePageId, formValues, onFormValueChange]),
    1000,
  );

  const handleFormSubmit = (data: FieldValues) => {
    const activePageIndex = formConfig?.pages?.indexOf(activePageId);
    const nextPageId = formConfig?.pages?.[activePageIndex + 1] || formConfig?.pages?.[activePageIndex];
    onFormSubmit?.(data);
    onActivePageIdChange?.(nextPageId);
  };

  return (
    <Form {...form}>
      <form
        className="mt-1 flex flex-col gap-3 w-full transition-all duration-200 ease-in-out"
        onSubmit={form.handleSubmit(handleFormSubmit, (errors) => console.log(JSON.stringify(errors, null, 2)))}
      >
        <FormPageName name={activePage?.name} color={formConfig?.theme?.properties?.primaryTextColor} />
        <FormFieldContainer
          activePage={activePage}
          formConfig={formConfig}
          control={form.control}
          formValuesByPageMap={formValuesByPageMap}
          fieldVisibilityMap={fieldVisibilityMap}
          actionDisabler={setShouldDisableActions}
        />
        <FormActions
          isFormSubmitting={isFormSubmitting}
          activePageId={activePageId}
          formConfig={formConfig}
          onActivePageIdChange={onActivePageIdChange}
          shouldDisableActions={shouldDisableActions}
        />
      </form>
    </Form>
  );
};

const FormFieldContainer = ({
  activePage,
  formConfig,
  control,
  formValuesByPageMap,
  fieldVisibilityMap,
  actionDisabler,
}: {
  activePage: PageEntity;
  formConfig: FormProps['formConfig'];
  control: UseFormReturn['control'];
  formValuesByPageMap: FormContentProps['formValuesByPageMap'];
  fieldVisibilityMap?: FormContentProps['fieldVisibilityMap'];
  actionDisabler?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pageFields = activePage?.fields;
  const activePageId = activePage?.id;
  const fieldEntities = formConfig?.fieldEntities;

  return (
    <div className="flex flex-wrap w-full overflow-clip gap-5 transition-all duration-200 ease-in-out">
      {pageFields?.map(
        (field) =>
          fieldVisibilityMap?.[field] !== false && (
            <FieldRenderer
              key={field}
              field={fieldEntities?.[field]}
              formConfig={formConfig}
              control={control}
              formValuesByPageMap={formValuesByPageMap}
              pageId={activePageId}
              actionDisabler={actionDisabler}
            />
          ),
      )}
    </div>
  );
};

export const FormActions = ({
  activePageId,
  formConfig,
  onActivePageIdChange,
  isFormSubmitting,
  shouldDisableActions,
}: Pick<FormContentProps, 'activePageId' | 'formConfig' | 'onActivePageIdChange' | 'isFormSubmitting'> & {
  shouldDisableActions?: boolean;
}) => {
  const isFirstPage = activePageId === formConfig?.pages?.[0];
  const isLastPage = activePageId === formConfig?.pages?.[formConfig?.pages?.length - 1];

  const activePageIndex = formConfig?.pages?.indexOf(activePageId);

  const previousPageId = formConfig?.pages?.[activePageIndex - 1] || formConfig?.pages?.[0];

  return (
    <>
      <div className="flex justify-between items-center gap-2 my-6 pl-2 pr-4">
        {formConfig?.pages?.length > 1 && (
          <Button
            type="button"
            variant={'secondary'}
            disabled={isFirstPage || isFormSubmitting || shouldDisableActions}
            onClick={() => onActivePageIdChange(previousPageId)}
            size={'default'}
          >
            Go Back
          </Button>
        )}

        <Button type="submit" variant={'default'} disabled={isFormSubmitting || shouldDisableActions} size={'default'}>
          {isLastPage ? 'Submit' : 'Next'}
          {isLastPage && isFormSubmitting && <LoaderCircle className="ml-2 w-4 h-4 animate-spin" />}
        </Button>
      </div>
    </>
  );
};

export default FormContent;
