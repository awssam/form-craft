'use server';

import { type FormIntegration as FormIntegrationType } from '@/types/integration';
import { convertToPlainObject, verifyAuth } from '../util';
import FormIntegration, { type FormIntegrationType as FormIntegrationModelType } from '../models/formIntegration';
import { type RootFilterQuery } from 'mongoose';
import connectDb from '../db/connection';

export const saveFormIntegration = async (formIntegration: FormIntegrationType) => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const integration = await FormIntegration.updateOne(
      {
        formId: formIntegration?.formId,
        userId,
        provider: formIntegration?.provider,
      },
      {
        ...formIntegration,
        userId,
      },
      { upsert: true, new: true },
    );

    return {
      success: true,
      data: convertToPlainObject(integration) as FormIntegrationType,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getFormIntegrations = async (formId: string, filter?: RootFilterQuery<FormIntegrationModelType>) => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const integrations = await FormIntegration.find({ ...filter, userId, formId });
    return {
      success: true,
      data: convertToPlainObject(integrations) as FormIntegrationType[],
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};
