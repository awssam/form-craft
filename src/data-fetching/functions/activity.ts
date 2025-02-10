import { createNewActivityAction } from '@/backend/actions/activity';
import { ActivityModelType } from '@/backend/models/activity';

export const createNewActivity = async (data: ActivityModelType) => {
  const res = await createNewActivityAction(data);

  if (res?.success) return res?.data;

  if (res?.error) {
    throw new Error(res?.error as string);
  }
};
