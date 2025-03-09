'use client';

import { cn } from '@/lib/utils';
import type { CustomValidationType, FieldType, FormConfig } from '@/types/form-config';
import React, { useCallback, useEffect, useMemo } from 'react';
import FormContent from './FormContent';
import FormHeader from './FormHeader';
import { toast } from 'sonner';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import useFieldConditionalLogicCheckGeneric from '@/hooks/useFieldConditionalLogicCheck';
import useFormSubmissionId from '@/hooks/useFormSubmissionId';
import { useCreateFormSubmissionMutation } from '@/data-fetching/client/formSubmission';

import { CUSTOM_FIELD_VALIDATIONS } from '@/lib/validation';
import { useCreateActivityMutation } from '@/data-fetching/client/activity';
import FormFooter from './FormFooter';

export interface FormProps {
  formConfig: FormConfig;
}

type FormValueByPageMap = Record<string, Record<string, unknown>>;

const classes = cn(
  'flex flex-col gap-9 border-yellow-200/10 px-3 py-5 md:px-7 md:py-5 mx-auto my-auto border border-dashed rounded-md w-[95%] md:w-[min(80%,890px)] transition-all duration-200',
);

const Form = ({ formConfig: config }: FormProps) => {
  const [formValuesByPage, setFormValuesByPage] = React.useState<FormValueByPageMap>({});
  const [formConfig, setFormConfig] = React.useState(config);
  const [activePageId, setActivePageId] = React.useState(formConfig?.pages?.[0]);
  const [fieldEntities, setFieldEntities] = React.useState(config?.fieldEntities);

  const [isSubmissionSuccess, setIsSubmissionSuccess] = React.useState(false);

  const [fieldVisibilityMap, setFieldVisibiltyMap] = React.useState<Record<string, boolean>>({});
  const allFields = useMemo(() => Object.keys(formConfig.fieldEntities), [formConfig?.fieldEntities]);

  const formSubmissionId = useFormSubmissionId();

  const { mutateAsync: createFormSubmission, isPending: isSubmitting } = useCreateFormSubmissionMutation({
    onError: (error) => {
      toast.error('Error', {
        description: (error as Error).message,
        duration: 3000,
      });
    },
  });

  const { mutateAsync: createActivity } = useCreateActivityMutation({});

  const router = useRouter();

  const currentPageNumber = useMemo(
    () => formConfig?.pages?.indexOf(activePageId) + 1,
    [activePageId, formConfig?.pages],
  );

  const handleFormSubmit = (data: FieldValues) => {
    const updatedState = { ...formValuesByPage, [activePageId]: data };

    const isLastPage = activePageId === formConfig?.pages?.[formConfig?.pages?.length - 1];

    setFormValuesByPage(updatedState);

    const formValueRecordsByName = Object.values(formValuesByPage);
    const values = formValueRecordsByName?.reduce((acc, curr) => {
      acc = { ...acc, ...curr };
      return acc;
    }, {});

    const newFormSubmission = {
      formId: config?.id,
      submissionType: 'anonymous',
      submittedBy: formSubmissionId || '',
      data: values,
      status: isLastPage ? 'completed' : 'pending',
    };

    if (isLastPage) {
      return createFormSubmission(newFormSubmission, {
        onSettled: (data) => {
          if (data?._id) {
            setIsSubmissionSuccess(true);
            createActivity({
              type: 'submission',
              formId: config?.id,
              formName: config?.name,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        },
      });
    }
    createFormSubmission(newFormSubmission);
  };

  const handleActivePageIdChange = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  const handleFieldVisibilityChange = useCallback((fieldId: string, isVisible: boolean) => {
    setFieldVisibiltyMap((prev) => ({ ...prev, [fieldId]: isVisible }));
  }, []);

  useEffect(() => {
    const fieldEntities = config?.fieldEntities;

    const pages = config?.pages;

    const getFieldUpdateWithCorrectValidationType = (
      fieldId: string,
      fieldType: FieldType,
      validationType: CustomValidationType,
      validatorKey: string,
    ) => {
      const field = fieldEntities?.[fieldId];
      const fieldValidations =
        CUSTOM_FIELD_VALIDATIONS?.[fieldType as keyof typeof CUSTOM_FIELD_VALIDATIONS] ?? CUSTOM_FIELD_VALIDATIONS.text;

      const validationMap = fieldValidations?.[validationType as keyof typeof fieldValidations];
      const customValidation = field?.validation?.custom?.[validatorKey];

      let validationFn: ((value: string) => boolean) | null = null;
      let args: unknown[] = [];

      if (validationType === 'withValue') {
        args = [customValidation?.value, customValidation?.message];
      }

      if (validationType === 'binary') {
        args = [customValidation?.message];
      }

      const validationFunctor = validationMap?.[validatorKey as keyof typeof validationMap] as (
        ...args: unknown[]
      ) => (value: string) => boolean;

      validationFn = validationFunctor?.(...args);

      return {
        [validatorKey]: validationFn ?? (() => true),
      };
    };

    pages?.forEach((pageId) => {
      const fields = config?.pageEntities?.[pageId]?.fields;

      fields?.forEach((fieldId) => {
        const field = fieldEntities?.[fieldId];
        const fieldUpdates = {
          validation: {
            ...field?.validation,
            validate: {
              ...field?.validation?.validate,
            },
          },
        };

        Object.entries(field?.validation?.custom || {})?.forEach(([key, value]) => {
          const fieldType = field?.type as FieldType;
          fieldUpdates.validation.validate = {
            ...fieldUpdates.validation.validate,
            ...getFieldUpdateWithCorrectValidationType(fieldId, fieldType, value?.type, key),
          };
        });

        setFormConfig((prev) => {
          return {
            ...prev,
            fieldEntities: {
              ...prev?.fieldEntities,
              [fieldId]: {
                ...prev?.fieldEntities?.[fieldId],
                ...fieldUpdates,
              },
            },
          };
        });
      });
    });
  }, [config]);

  useFieldConditionalLogicCheckGeneric(allFields!, fieldEntities, handleFieldVisibilityChange);

  if (isSubmissionSuccess) {
    return (
      <section
        className={'m-auto text-center grid gap-1'}
        style={{ backgroundColor: formConfig?.theme?.properties?.formBackgroundColor }}
      >
        <h3 className="text-white text-xl sm:text-3xl font-bold">Thank you!</h3>
        <p className="text-white/90  text-sm sm:text-xl">Your form has been successfully submitted.</p>

        <Button variant={'default'} onClick={() => router.replace('/')}>
          Go Home
        </Button>
      </section>
    );
  }

  return (
    <section
      className={classes}
      style={{
        backgroundColor: formConfig?.theme?.properties?.formBackgroundColor,
        boxShadow: '1px 1px 20px 4px #130d18',
        borderRadius: 20,
      }}
    >
      <FormHeader formConfig={formConfig} currentPageNumber={currentPageNumber} />
      <FormContent
        key={activePageId} // should destroy and re-render when activePageId changes
        formConfig={formConfig}
        formValuesByPageMap={formValuesByPage}
        fieldVisibilityMap={fieldVisibilityMap}
        activePageId={activePageId}
        onActivePageIdChange={handleActivePageIdChange}
        onFormSubmit={handleFormSubmit}
        onPageFieldChange={setFieldEntities}
        onFormValueChange={setFormValuesByPage}
        isFormSubmitting={isSubmitting}
      />
      <FormFooter />
    </section>
  );
};

export default Form;
