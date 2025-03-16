'use server';

import { AirtableIntegration, GoogleSheetIntegration, WebhookIntegration } from '@/types/integration';
import connectDb from '../db/connection';
import Form from '../models/form';
import FormIntegration from '../models/formIntegration';
import FormSubmission, { FormSubmissionModelType } from '../models/formSubmission';
import { convertToPlainObject, verifyAuth } from '../util';
import { getClient } from './google';
import ConnectedAccount from '../models/connectedAccount';
import { google } from 'googleapis';
import { FieldEntity, FormConfig } from '@/types/form-config';
import { formatDate } from 'date-fns';
import { airtableFetchWithToken } from './airtable';
import Activity from '../models/activity';
import { isValidUrl } from '@/lib/utils';

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

    // run form integrations

    if (existingSubmission) {
      if (existingSubmission.get('status') === 'pending' && data?.['status'] === 'completed') {
        runFormIntegrations(data?.formId, data?.data).catch((error) =>
          console.log('Error running form integrations', error?.message),
        );
      }
    } else if (data?.['status'] === 'completed') {
      runFormIntegrations(data?.formId, data?.data).catch((error) =>
        console.log('Error running form integrations', error?.message),
      );
    }

    if (existingSubmission && existingSubmission?.get('status') === 'completed') {
      throw new Error('You have already submitted this form.');
    } else if (existingSubmission && existingSubmission?.get('status') === 'pending') {
      existingSubmission.set('data', data?.data);
      existingSubmission.set('status', data?.status);

      const res = await existingSubmission.save();

      return { success: true, data: convertToPlainObject(res) };
    } else {
      const newSubmission = await FormSubmission.create({
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

export const getFormSubmissionsAction = async (formId: string, filter?: Record<string, unknown>) => {
  try {
    await connectDb();
    const userId = await verifyAuth();

    const form = await Form.findOne({ id: formId, createdBy: userId })?.lean();

    if (!form) throw new Error('Form not found');

    const res = await FormSubmission.find({ ...filter, formId })
      .sort({ createdAt: -1 })
      ?.lean();

    const data = {
      formConfig: form,
      submissions: res as unknown as FormSubmissionModelType[],
    };

    return { success: true, data: convertToPlainObject(data) as unknown as typeof data };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
  }
};

const runFormIntegrations = async (formId: string, data: FormSubmissionModelType['data']) => {
  try {
    const [formIntegrations, formConfig] = await Promise.all([
      FormIntegration.find({ formId })?.lean(),
      Form.findOne({ id: formId?.toString() })?.lean(),
    ]);

    for (const formIntegration of formIntegrations) {
      switch (formIntegration?.provider) {
        case 'airtable':
          postDataIntoAirtable(formIntegration as AirtableIntegration, data, formConfig as unknown as FormConfig);
          break;
        case 'google': {
          postDataIntoGoogleSheet(formIntegration as GoogleSheetIntegration, data, formConfig as unknown as FormConfig);
          break;
        }
        case 'webhook': {
          postDataIntoWebhook(formIntegration as WebhookIntegration, data, formConfig as unknown as FormConfig);
          break;
        }
        default:
          break;
      }
    }
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const createNewIntegrationLog = async (formId: string, formName: string, details: Record<string, unknown>) => {
  try {
    const activity = new Activity({
      type: 'integration_error',
      formName: formName,
      formId,
      details,
    });
    await activity.save();
    return activity;
  } catch {
    return null;
  }
};

export const postDataIntoGoogleSheet = async (
  integration: GoogleSheetIntegration,
  data: FormSubmissionModelType['data'],
  form: FormConfig,
) => {
  try {
    console.log('INTEGRATION_RUN_START_GOOGLE', JSON.stringify(integration, null, 2));
    const formFields = Object.entries(form?.fieldEntities)?.reduce((acc, [, field]) => {
      acc[field?.name as keyof typeof acc] = field;
      return acc;
    }, {} as Record<string, FieldEntity>);

    const gsRowData = integration?.config?.worksheetColumnHeaders?.map((column) => {
      const associatedFieldName = integration?.fieldMappings?.[column];
      const fieldType = formFields?.[associatedFieldName]?.type;
      const value = data?.[associatedFieldName as keyof typeof data];

      if (fieldType === 'date') {
        return formatDate(value as string, 'dd MMM, yyyy');
      }

      if ((fieldType === 'checkbox' || fieldType === 'dropdown') && Array.isArray(value)) {
        return (value as unknown as string[])?.join(', ');
      }

      return value;
    }) as string[];

    const client = await getClient();

    const connectedAccount = await ConnectedAccount.findOne({ provider: 'google', userId: integration?.userId });

    client.setCredentials({
      access_token: connectedAccount?.accessToken,
      refresh_token: connectedAccount?.refreshToken,
    });

    const sheets = google.sheets({ version: 'v4', auth: client });

    console.log('POSTING DATA INTO GOOGLE SHEET', JSON.stringify(gsRowData, null, 2));

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: integration?.config?.spreadsheet?.value as string,
      range: integration?.config?.worksheet?.value as string,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [gsRowData],
      },
    });

    console.log('POSTED DATA INTO GOOGLE SHEET', JSON.stringify(res?.data, null, 2));

    if (res?.data) {
      return { success: true, data: res };
    }
  } catch (error) {
    console.log('error', error);

    console.log('Error saving data into Google sheet: ', error);
    const newActivity = await Activity.create({
      type: 'integration_error',
      formId: form?.id,
      formName: form?.name,
      details: {
        provider: 'google',
        message: error instanceof Error ? error?.message : error,
      },
    });

    await newActivity?.save().catch(console.log);

    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  } finally {
    console.log('INTEGRATION_RUN_END_GOOGLE');
  }
};

export const postDataIntoAirtable = async (
  integration: AirtableIntegration,
  data: FormSubmissionModelType['data'],
  form: FormConfig,
) => {
  console.time('integration_airtable');
  try {
    console.log('INTEGRATION_RUN_START', JSON.stringify(integration, null, 2));

    const connectedAccount = await ConnectedAccount.findOne({ provider: 'airtable', userId: integration.userId });

    const formFields = Object.entries(form?.fieldEntities)?.reduce((acc, [, field]) => {
      acc[field?.name as keyof typeof acc] = field;
      return acc;
    }, {} as Record<string, FieldEntity>);

    const fieldMappings = integration?.fieldMappings;

    const airtableRowData = Object.entries(fieldMappings ?? {})?.reduce((acc, [column, associatedFieldName]) => {
      const fieldType = formFields?.[associatedFieldName]?.type;
      const value = data?.[associatedFieldName as keyof typeof data];

      if (fieldType === 'date') {
        return { ...acc, [column]: formatDate(value as string, 'dd MMM, yyyy') };
      }

      if ((fieldType === 'checkbox' || fieldType === 'dropdown') && Array.isArray(value)) {
        return { ...acc, [column]: (value as unknown as string[])?.join(', ') };
      }

      return { ...acc, [column]: value };
    }, {});

    const baseId = integration?.config?.base?.value;
    const tableId = integration?.config?.table?.value;

    const requestBody = JSON.stringify({
      fields: airtableRowData,
      typecast: false,
    });

    console.info('Posting data into Airtable: ', requestBody);

    const res = await airtableFetchWithToken(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: 'POST',
      body: requestBody,
      token: connectedAccount?.accessToken as string,
    });

    console.log('response from airtable', res);

    if (res?.data && !res?.data?.error) {
      if (Object.keys(airtableRowData)?.length !== Object.keys(res?.data?.fields)?.length) {
        createNewIntegrationLog(form?.id, form?.name, {
          provider: 'airtable',
          message:
            'One or more fields failed to sync with Airtable, This is likely caused because of a mismatch in field types and allowed values between the form and Airtable. Please check the form configuration and try again.',
        });
      }

      console.info('Data saved into Airtable: ', res?.data);

      return { success: true, data: res };
    }

    if (res?.data?.error) {
      console.log('Error saving data into Airtable: ', res?.data?.error);
      createNewIntegrationLog(form?.id, form?.name, {
        provider: 'airtable',
        message: res?.data?.error?.message,
      });

      return { success: false, error: res?.error };
    }
  } catch (error) {
    console.log('Error saving data into Airtable: ', error);

    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  } finally {
    console.log('INTEGRATION_RUN_END');
    console.timeEnd('integration_airtable');
  }
};

export const postDataIntoWebhook = async (
  integration: WebhookIntegration,
  data: FormSubmissionModelType['data'],
  form: FormConfig,
) => {
  try {
    console.time('integration_webhook');
    console.log('INTEGRATION_RUN_START', JSON.stringify(integration, null, 2));

    const webhookUrl = integration?.config?.url;

    if (!isValidUrl(webhookUrl)) {
      throw new Error('Invalid Webhook URL');
    }

    const headers = integration?.config?.headers?.reduce((acc, header) => {
      acc[header?.key] = header?.value;
      acc['Content-Type'] = 'application/json';
      return acc;
    }, {} as Record<string, string>);

    const webhookBody = Object.values(form?.fieldEntities)?.reduce((acc, field) => {
      acc[field?.label] = data?.[field?.name as keyof typeof data];
      return acc;
    }, {} as Record<string, unknown>);

    const res = await fetch(webhookUrl as string, {
      method: integration?.config?.httpMethod || 'POST',
      headers,
      body: JSON.stringify(webhookBody),
    });

    if (res?.status >= 400) {
      throw new Error(`Error saving data into Webhook: ${res?.status} - ${res?.statusText}`);
    } else {
      console.info('Data saved into Webhook: ');
      return { success: true, data: res };
    }
  } catch (error) {
    console.log('Error saving data into Webhook: ', error);

    createNewIntegrationLog(form?.id, form?.name, {
      provider: 'webhook',
      message: error instanceof Error ? error?.message : error,
    });
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  } finally {
    console.log('INTEGRATION_RUN_END');
    console.timeEnd('integration_webhook');
  }
};
