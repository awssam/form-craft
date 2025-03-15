import { getClient } from '@/backend/actions/google';
import ConnectedAccount, { type ConnectedAccountType } from '@/backend/models/connectedAccount';
import { getUnixTime } from '@/lib/datetime';
import type { Document } from 'mongoose';
import { NextRequest } from 'next/server';

import jwt, { JwtPayload } from 'jsonwebtoken';
import connectDb from '@/backend/db/connection';

const clientId = process.env.AIRTABLE_CLIENT_ID || '';
const clientSecret = process.env.AIRTABLE_CLIENT_SECRET || '';

const _refreshAndUpdateGoogleToken = async (connectedAccount: Document<ConnectedAccountType>) => {
  try {
    const oauth2Client = await getClient();

    oauth2Client.setCredentials({
      access_token: connectedAccount.get('accessToken'),
      refresh_token: connectedAccount?.get('refreshToken'),
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    if (!credentials) {
      console.error(
        'Error refreshing token for account ',
        `UserId - ${connectedAccount?.get('userId')}, Email - ${connectedAccount?.get('accountEmail')}`,
      );

      return 0;
    }

    const unixTimestampInSeconds = getUnixTime(credentials.expiry_date as number);

    connectedAccount.set('accessToken', credentials.access_token);
    connectedAccount.set('refreshToken', credentials.refresh_token);
    connectedAccount.set('expiryDate', unixTimestampInSeconds);
    await connectedAccount.save();

    return 1;
  } catch (error) {
    console.log('Error => ', error);
    return 0;
  }
};

const _refreshAndUpdateAirtableToken = async (connectedAccount: Document<ConnectedAccountType>) => {
  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch(`${process.env.AIRTABLE_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`, // Corrected authorization header
      },
      body: new URLSearchParams({
        refresh_token: connectedAccount?.get('refreshToken'),
        grant_type: 'refresh_token',
      }).toString(), // Ensure proper encoding
    });

    const authDetails = await res.json();

    if (!authDetails?.access_token) {
      console.error(
        'Error refreshing token for account ',
        `UserId - ${connectedAccount?.get('userId')}, Email - ${connectedAccount?.get('accountEmail')}`,
      );

      return 0;
    }

    const currentTime = new Date().toISOString();
    const expiryDate = new Date(currentTime);
    expiryDate.setUTCSeconds(expiryDate.getUTCSeconds() + authDetails?.expires_in);

    connectedAccount.set('accessToken', authDetails?.access_token);
    connectedAccount.set('refreshToken', authDetails?.refresh_token);
    connectedAccount.set('expiryDate', getUnixTime(expiryDate));

    await connectedAccount.save();

    return 1;
  } catch (error) {
    console.log('Error => ', error);
    return 0;
  }
};

export const GET = async (req: NextRequest) => {
  const headers = req.headers;

  const authorization = headers.get('authorization');

  const token = authorization?.split(' ')?.[1] || null;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectDb();

  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

  if (payload?.sub !== 'refresh_token_update' && payload?.iss !== 'formcraft_app') {
    return new Response('Unauthorized', { status: 401 });
  }

  console.time('REFRESH_INTEGRATION_TOKENS');

  console.info('Refresh Integration Access Tokens - START');

  const BUFFER_TIME_IN_SECONDS = 15 * 60;
  const now = getUnixTime(new Date().toISOString());

  const allConnectedAccounts = await ConnectedAccount.find({
    expiryDate: { $lte: now + BUFFER_TIME_IN_SECONDS },
  });

  console.info('Accounts to refresh', allConnectedAccounts?.length, 'Refresh Integration Access Tokens - START');

  let successCount = 0;
  for (const connectedAccount of allConnectedAccounts) {
    console.log(
      'Refreshing token for account ',
      `UserId - ${connectedAccount?.userId}, Provider - ${connectedAccount?.provider}, Email - ${connectedAccount?.accountEmail}`,
    );
    const account = connectedAccount as Document<ConnectedAccountType>;
    if (connectedAccount?.provider === 'google') {
      const result = await _refreshAndUpdateGoogleToken(account);
      successCount += result;
    } else if (connectedAccount?.provider === 'airtable') {
      const result = await _refreshAndUpdateAirtableToken(account);
      successCount += result;
    }
  }

  console.log(`Successfully refreshed ${successCount} tokens out of ${allConnectedAccounts?.length}`);

  console.info('Refresh Integration Access Tokens - END');

  console.timeEnd('REFRESH_INTEGRATION_TOKENS');

  return new Response(
    JSON.stringify({
      data: {
        success: successCount,
        failed: allConnectedAccounts?.length - successCount,
        processed: allConnectedAccounts?.length,
      },
    }),
    {
      status: 200,
    },
  );
};
