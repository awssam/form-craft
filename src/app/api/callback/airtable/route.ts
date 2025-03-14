import ConnectedAccount from '@/backend/models/connectedAccount';
import { verifyAuth } from '@/backend/util';
import { getUnixTime } from 'date-fns';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const userId = await verifyAuth();
  const { searchParams } = new URL(req?.url);

  if (!req.cookies.has('airtable_state') || !req.cookies.has('airtable_code_verifier') || !userId) {
    return redirect('/');
  }
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const clientId = process.env.AIRTABLE_CLIENT_ID || '';
  const clientSecret = process.env.AIRTABLE_CLIENT_SECRET || '';

  if (error || errorDescription) {
    return redirect(`/error?error=${error}&error_description=${errorDescription}`);
  }

  const codeVerifier = req.cookies.get('airtable_code_verifier')?.value;

  if (state && codeVerifier) {
    // Base64 encode the entire "clientId:clientSecret" string
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch(`${process.env.AIRTABLE_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authHeader}`, // Corrected authorization header
      },
      body: new URLSearchParams({
        code: code || '',
        code_verifier: codeVerifier,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI || '',
        grant_type: 'authorization_code',
      }).toString(), // Ensure proper encoding
    });

    const authDetails = await res.json();

    const data = await fetch('https://api.airtable.com/v0/meta/whoami', {
      headers: {
        Authorization: `Bearer ${authDetails.access_token}`,
      },
    });

    const userDetails = await data.json();

    const isExistingAccount = await ConnectedAccount.findOne({ accountId: userDetails?.id });

    if (isExistingAccount) {
      return redirect('/builder?integration=airtable');
    }

    console.log('Creating connected account for user', userId, userDetails?.email);

    const currentTime = new Date().toISOString();
    const expiryDate = new Date(currentTime);
    expiryDate.setUTCSeconds(expiryDate.getUTCSeconds() + authDetails?.expires_in);

    if (!isExistingAccount) {
      const user = await ConnectedAccount.create({
        userId,
        accountId: userDetails?.id,
        provider: 'airtable',
        accessToken: authDetails?.access_token,
        refreshToken: authDetails?.refresh_token,
        expiryDate: getUnixTime(expiryDate),
        tokenType: authDetails?.token_type,
        scope: userDetails?.scopes?.join(', '),
        accountEmail: userDetails?.email,
        idToken: codeVerifier,
      });
      await user.save();

      return redirect('/builder?integration=airtable');
    }
  }
};
