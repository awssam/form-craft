import {
  disconnectGoogleAccountAction,
  getAllColumnHeadersFromWorksheetAction,
  getAllUserSpreadSheetsFromDriveAction,
  getAllWorksheetsFromSpreadSheetAction,
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

export const getAllUserSpreadSheetsFromDrive = async () => {
  const res = await getAllUserSpreadSheetsFromDriveAction();

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || [];
};

export const getAllWorksheetsFromSpreadSheet = async (spreadsheetId: string) => {
  const res = await getAllWorksheetsFromSpreadSheetAction(spreadsheetId);

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || [];
};

export const getAllColumnHeadersFromWorksheet = async (spreadsheetId: string, sheetName: string) => {
  const res = await getAllColumnHeadersFromWorksheetAction(spreadsheetId, sheetName);

  if (!res?.success) {
    throw new Error(res?.error as string);
  }

  return res?.data || [];
};
