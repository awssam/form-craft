'use server';

import { google } from 'googleapis';

import ConnectedAccount, { ConnectedAccountType } from '../models/connectedAccount';
import { convertToPlainObject, verifyAuth } from '../util';
import { getAppOriginUrl } from '@/lib/utils';

export const getClient = async () => {
  const url = `${getAppOriginUrl()}${process.env.GOOGLE_REDIRECT_URI || ''}`;
  const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, url);
  return client;
};

export const getAuthorizationUrl = async () => {
  try {
    const client = await getClient();
    return {
      success: true,
      data: client.generateAuthUrl({
        scope: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/drive.readonly',
        ],
        access_type: 'offline',
      }),
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: error,
    };
  }
};

export const getAccessTokenAction = async (code: string) => {
  try {
    const client = await getClient();
    return {
      success: true,
      data: await client.getToken(code),
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }
    return {
      success: false,
      error: error,
    };
  }
};

export const getConnectedGoogleAccountAction = async () => {
  const userId = await verifyAuth();

  try {
    const connectedAccount = await ConnectedAccount.findOne({ userId, provider: 'google' })?.lean();

    return {
      success: true,
      data: convertToPlainObject(connectedAccount || {}) as ConnectedAccountType,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const disconnectGoogleAccountAction = async () => {
  const userId = await verifyAuth();

  try {
    await ConnectedAccount.deleteOne({ userId, provider: 'google' });
    return {
      success: true,
      data: true,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAllUserSpreadSheetsFromDriveAction = async () => {
  try {
    const userId = await verifyAuth();
    const connectedAccount = await ConnectedAccount.findOne({ provider: 'google', userId })?.lean();

    const client = await getClient();

    client.setCredentials({
      access_token: connectedAccount?.accessToken,
      refresh_token: connectedAccount?.refreshToken,
    });

    const drive = google.drive({ version: 'v3', auth: client });

    const res = await drive.files.list({
      pageSize: 100,
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: 'nextPageToken, files(id, name)',
    });

    return {
      success: true,
      data: res?.data?.files || [],
    };
  } catch (error) {
    console.log('error', error);
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAllWorksheetsFromSpreadSheetAction = async (spreadsheetId: string) => {
  try {
    const userId = await verifyAuth();
    const connectedAccount = await ConnectedAccount.findOne({ provider: 'google', userId })?.lean();

    if (!connectedAccount || !spreadsheetId) return { success: false, error: 'Invalid request' };

    const client = await getClient();

    client.setCredentials({
      access_token: connectedAccount?.accessToken,
      refresh_token: connectedAccount?.refreshToken,
    });

    const sheets = google.sheets({ version: 'v4', auth: client });

    const res = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: true,
    });

    return {
      success: true,
      data: res?.data?.sheets || [],
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAllColumnHeadersFromWorksheetAction = async (spreadsheetId: string, worksheetName: string) => {
  try {
    const userId = await verifyAuth();
    const connectedAccount = await ConnectedAccount.findOne({ provider: 'google', userId })?.lean();

    if (!connectedAccount || !spreadsheetId) return { success: false, error: 'Invalid request' };

    const client = await getClient();

    client.setCredentials({
      access_token: connectedAccount?.accessToken,
      refresh_token: connectedAccount?.refreshToken,
    });

    const sheets = google.sheets({ version: 'v4', auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${worksheetName}!1:1`,
    });

    return {
      success: true,
      data: res?.data?.values || [],
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};
