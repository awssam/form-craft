'use server';

import { google } from 'googleapis';

import ConnectedAccount, { ConnectedAccountType } from '../models/connectedAccount';
import { convertToPlainObject, verifyAuth } from '../util';

export const getClient = async () => {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  return client;
};

export const getAuthorizationUrl = async () => {
  try {
    const client = await getClient();
    return {
      success: true,
      data: client.generateAuthUrl({
        scope: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/userinfo.email'],
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
