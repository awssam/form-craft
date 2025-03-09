import {
  disconnectAirtableAccountAction,
  getAirtableAuthorizationUrl as getAirtableAuthorizationUrlAction,
  getAirtableBasesAction,
  getAirtableBaseTablesAction,
  getConnectedAirtableAccountAction,
} from '@/backend/actions/airtable';

export const getAuthorizationUrl = async () => {
  const res = await getAirtableAuthorizationUrlAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || '';
};

export const getConnectedAirtableAccount = async () => {
  const res = await getConnectedAirtableAccountAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || null;
};

export const disconnectAirtableAccount = async () => {
  const res = await disconnectAirtableAccountAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || null;
};

export const getAirtableBases = async () => {
  const res = await getAirtableBasesAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || [];
};

export const getAirtableTables = async (baseId: string) => {
  const res = await getAirtableBaseTablesAction(baseId);

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || [];
};
