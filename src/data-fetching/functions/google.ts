import {
  disconnectGoogleAccountAction,
  getAuthorizationUrl as getAuthorizationUrlAction,
  getConnectedGoogleAccountAction,
} from '@/backend/actions/google';

export const getAuthorizationUrl = async () => {
  const res = await getAuthorizationUrlAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || '';
};

export const getConnectedGoogleAccount = async () => {
  const res = await getConnectedGoogleAccountAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || null;
};

export const disconnectGoogleAccount = async () => {
  const res = await disconnectGoogleAccountAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || null;
};
