'use server';

import { createNewForm } from '@/lib/form';
import connectDb from '../db/connection';
import Form from '../models/form';
import { verifyAuth } from '../util';

export const createFormConfig = async () => {
  try {
    const userId = await verifyAuth();

    await connectDb();

    const newForm = createNewForm(userId as string);
    const form = new Form(newForm);
    const res = await form.save();

    return {
      success: true,
      data: res?.toJSON(),
    };
  } catch (error) {
    return {
      success: false,
      error: error,
    };
  }
};
