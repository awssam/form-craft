'use server';

import connectDb from '../db/connection';
import Form from '../models/form';
import FormSubmission, { FormSubmissionModelType } from '../models/formSubmission';
import { convertToPlainObject } from '../util';

export const createNewFormSubmissionAction = async (data: FormSubmissionModelType) => {
  try {
    await connectDb();

    const form = await Form.findOne({ id: data?.formId });

    if (!form) throw new Error('Form not found');

    if (form.status !== 'published') throw new Error('This form is not published yet. Please contact its owner.');

    const existingSubmission = await FormSubmission.findOne({
      formId: data?.formId,
      submittedBy: data?.submittedBy,
    });

    if (existingSubmission && existingSubmission?.get('status') === 'completed') {
      throw new Error('You have already submitted this form.');
    } else if (existingSubmission && existingSubmission?.get('status') === 'pending') {
      existingSubmission.set('data', data?.data);
      existingSubmission.set('status', data?.status);

      const res = await existingSubmission.save();
      return { success: true, data: res };
    } else {
      const newSubmission = await new FormSubmission({
        formId: data?.formId,
        submittedBy: data?.submittedBy,
        data: data?.data,
        status: data?.status,
      });

      const res = await newSubmission.save();

      return { success: true, data: convertToPlainObject(res) };
    }
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
  }
};
