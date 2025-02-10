'use server';

import connectDb from '../db/connection';
import Activity, { ActivityModelType } from '../models/activity';
import Form from '../models/form';
import { verifyAuth } from '../util';

export const createNewActivityAction = async (data: ActivityModelType) => {
  try {
    if (!data?.type) throw new Error('Activity type is required');

    await connectDb();

    const newActivity = await Activity.create(data);

    await newActivity.save();

    if (!newActivity) throw new Error('Failed to create activity');

    return { success: true, data: newActivity };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAllActivitiesFromLastWeekAction = async () => {
  try {
    const userId = await verifyAuth();
    await connectDb();

    const formsCreatedByUser = await Form.find({ createdBy: userId })?.lean();

    const res = await Activity.find({
      formId: { $in: formsCreatedByUser?.map((form) => form?.id) },
      createdAt: { $gt: new Date(new Date().setDate(new Date().getDate() - 7)) },
    })
      ?.sort({
        createdAt: 'descending',
      })
      ?.lean();

    return { success: true, data: res };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};
