import { createNewFormSubmissionAction } from '@/backend/actions/formSubmission';
import { FormSubmissionModelType } from '@/backend/models/formSubmission';

export const createFormSubmission = async (data: Record<string, unknown>) => {
  const res = await createNewFormSubmissionAction(data as FormSubmissionModelType);
  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};
