'use server';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { convertToPlainObject, verifyAuth } from '../util';
import ConnectedAccount, { ConnectedAccountType } from '../models/connectedAccount';

export const airtableFetch = async (url: string, options: RequestInit) => {
  try {
    const userId = await verifyAuth();

    const connectedAccount = await ConnectedAccount.findOne({ userId, provider: 'airtable' })?.lean();

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${connectedAccount?.accessToken}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });

    return {
      success: true,
      data: await res.json(),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};
function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString('base64url');
}

function generateCodeChallenge(verifier: string) {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

const _constructAuthorizationUrl = async () => {
  try {
    const url = `${process.env.AIRTABLE_BASE_URL}/authorize`;
    const airtableUrl = new URL(url);
    const state = generateRandomString(16);

    const codeVerifier = generateRandomString(64);
    const codeChallenge = generateCodeChallenge(codeVerifier);

    airtableUrl.searchParams.set('client_id', process.env.AIRTABLE_CLIENT_ID || '');
    airtableUrl.searchParams.set('redirect_uri', process.env.AIRTABLE_REDIRECT_URI || '');
    airtableUrl.searchParams.set('response_type', 'code');
    airtableUrl.searchParams.set(
      'scope',
      'data.records:read data.records:write schema.bases:read schema.bases:write user.email:read',
    );
    airtableUrl.searchParams.set('state', state);
    airtableUrl.searchParams.set('code_challenge', codeChallenge);
    airtableUrl.searchParams.set('code_challenge_method', 'S256');

    return { codeVerifier, url: airtableUrl.toString() };
  } catch {
    return { codeVerifier: '', url: '' };
  }
};

// export const getAirtableClient = async () => {
//   const airtable = new Airtable({
//     apiKey: process.env.AIRTABLE_API_KEY,
//   })
// }

export const getAirtableAuthorizationUrl = async () => {
  try {
    const { url, codeVerifier } = await _constructAuthorizationUrl();

    const searchParams = new URL(url!).searchParams;

    const state = searchParams.get('state');

    const cookieStore = cookies();

    if (state && codeVerifier) {
      cookieStore.set('airtable_state', state, { secure: true, httpOnly: true });
      cookieStore.set('airtable_code_verifier', codeVerifier, { secure: true, httpOnly: true });
    }

    return {
      success: true,
      data: url,
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

export const getConnectedAirtableAccountAction = async () => {
  const userId = await verifyAuth();

  try {
    const connectedAccount = await ConnectedAccount.findOne({ userId, provider: 'airtable' })?.lean();

    return {
      success: true,
      data: convertToPlainObject(connectedAccount || {}) as ConnectedAccountType,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const disconnectAirtableAccountAction = async () => {
  const userId = await verifyAuth();

  try {
    await ConnectedAccount.deleteOne({ userId, provider: 'airtable' });

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAirtableBasesAction = async () => {
  try {
    const data = (await airtableFetch('https://api.airtable.com/v0/meta/bases', {}))?.data as {
      bases: { id: string; name: string; permissionLevel: string }[];
    };

    if (!data?.bases) throw new Error('Something went wrong');

    const basesWithEditAccess = data?.bases.filter(
      (base: { id: string; name: string; permissionLevel: string }) =>
        base?.permissionLevel === 'edit' || base?.permissionLevel === 'create',
    );

    return {
      success: true,
      data: basesWithEditAccess,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};

export const getAirtableBaseTablesAction = async (baseId: string) => {
  try {
    const res = await airtableFetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {});

    const data = res?.data as {
      tables: { id: string; name: string; fields: { id: string; name: string; type: string }[] }[];
    };

    return {
      success: true,
      data: data?.tables,
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error?.message };
    return { success: false, error: error };
  }
};
