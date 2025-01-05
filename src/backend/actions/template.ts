'use server';

import { FormConfig } from '@/types/form-config';
import FormTemplate, { TemplateModel } from '../models/template';
import { generateId } from '@/lib/utils';
import { convertToPlainObject } from '../util';
import connectDb from '../db/connection';
import { FormTemplate as FormTemplateType } from '@/types/template';

export const createNewTemplateAction = async (meta: TemplateModel['meta'], templateConfig: FormConfig) => {
  try {
    if (!meta?.name || !meta?.description) throw new Error('Template name and description are required');

    if (!templateConfig?.name) throw new Error('Invalid template config, It should be of type FormConfig');

    await connectDb();

    const newTemplate = new FormTemplate({
      id: generateId(),
      meta: {
        name: meta?.name?.trim(),
        description: meta?.description?.trim(),
        image: meta?.image?.trim(),
      },
      templateConfig: {
        ...templateConfig,
        id: generateId(),
        createdBy: 'SYSTEM', // User creating templates is not in scope of this app for now. So setting it to SYSTEM for now.
      },
    });

    const res = await newTemplate.save();

    return { success: true, data: convertToPlainObject(res?.toJSON()) };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };

    return { success: false, error: 'Something went wrong' };
  }
};

export const getAllTemplatesAction = async () => {
  try {
    await connectDb();
    // select all templates where templateConfig.createdBy = 'SYSTEM'
    const templates = await FormTemplate.find({ 'templateConfig.createdBy': 'SYSTEM' })?.lean();

    return { success: true, data: convertToPlainObject(templates) as FormTemplateType[] };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const deleteAllTemplatesAction = async () => {
  try {
    await connectDb();
    const res = await FormTemplate.deleteMany({ 'templateConfig.createdBy': 'SYSTEM' });
    return { success: true, data: convertToPlainObject(res) };
  } catch (error) {
    return { success: false, error: error };
  }
};
