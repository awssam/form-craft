import ConnectedAccount from '@/backend/models/connectedAccount';
import { verifyAuth } from '@/backend/util';
import { getClient } from '@/backend/actions/google';
import { google } from 'googleapis';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getUnixTime } from '@/lib/datetime';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req?.url);
  const code = searchParams.get('code');
  const userId = await verifyAuth();

  const oauth2Client = await getClient();

  const { tokens } = await oauth2Client.getToken(code as string);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data: userInfo } = await oauth2.userinfo.get();

  const isExistingAccount = await ConnectedAccount.findOne({ accountId: userInfo?.id });

  if (isExistingAccount) {
    return redirect('/builder?integration=google');
  }

  console.log('Creating connected account for user', userId);

  const unixTimestampInSeconds = getUnixTime(tokens?.expiry_date as number);

  if (!isExistingAccount) {
    const user = await ConnectedAccount.create({
      userId,
      accountId: userInfo?.id,
      provider: 'google',
      accessToken: tokens?.access_token,
      refreshToken: tokens?.refresh_token,
      expiryDate: unixTimestampInSeconds,
      tokenType: tokens?.token_type,
      idToken: tokens?.id_token,
      scope: tokens?.scope,
      accountEmail: userInfo?.email,
      accountPicture: userInfo?.picture,
    });
    await user.save();

    return redirect('/builder?integration=google');
  }
};
