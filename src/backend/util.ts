'use server';

import { auth } from '@clerk/nextjs/server';

export const verifyAuth = async () => {
  if (!auth().userId) {
    return {
      success: false,
      error: 'User not authenticated',
    };
  }

  return auth()?.userId;
};

export const convertToPlainObject = (obj: object) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return obj;
  }
};
