import ConnectedAccount from '@/backend/models/connectedAccount';
import { verifyAuth } from '@/backend/util';
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
    console.log('codeVerifier', codeVerifier);
    console.log('state', state);
    console.log('code', code);

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

    console.log('authDetails', authDetails);
    console.log('userDetails', userDetails);

    const isExistingAccount = await ConnectedAccount.findOne({ accountId: userDetails?.id });

    if (isExistingAccount) {
      return redirect('/builder?integration=airtable');
    }

    if (!isExistingAccount) {
      const user = await ConnectedAccount.create({
        userId,
        accountId: userDetails?.id,
        provider: 'airtable',
        accessToken: authDetails?.access_token,
        refreshToken: authDetails?.refresh_token,
        expiryDate: authDetails?.expiry_date,
        tokenType: authDetails?.token_type,
        scope: userDetails?.scopes?.join(', '),
        accountEmail: userDetails?.email,
        idToken: codeVerifier,
      });
      await user.save();

      return redirect('/builder?integration=airtable');
    }

    // Token Response: {
    //     token_type: 'Bearer',
    //     scope: 'data.records:read data.records:write schema.bases:read schema.bases:write user.email:read',
    //     access_token: 'oaanU1C3MVqtSNmw6.v1.eyJ1c2VySWQiOiJ1c3JjMlNWaUo5SjdpVG5ncSIsImV4cGlyZXNBdCI6IjIwMjUtMDMtMDhUMTc6Mjg6NTkuMDAwWiIsIm9hdXRoQXBwbGljYXRpb25JZCI6Im9hcE5zY0tHQVBYT2sxUVFhIiwic2VjcmV0IjoiODk2MTlkOGFiMTMzMjBmYTc2NzE3ZDliZjUyMjEzYzA5MjBmYzk5OTQ2ZmNkMDBhNTQ5NjI0ZTU0MTY4OGFkYiJ9.4975638f81933782c42360f3e23b2ab7bdd25bf5b944cd90793f8198d2002102',
    //     expires_in: 3600,
    //     refresh_token: 'oaanU1C3MVqtSNmw6.v1.refresh.eyJ1c2VySWQiOiJ1c3JjMlNWaUo5SjdpVG5ncSIsInJlZnJlc2hFeHBpcmF0aW9uVGltZSI6IjIwMjUtMDUtMDdUMTY6Mjg6NTkuMDAwWiIsIm9hdXRoQXBwbGljYXRpb25JZCI6Im9hcE5zY0tHQVBYT2sxUVFhIiwic2VjcmV0IjoiYzk5MmJhMDQ1YzExYzU2M2YxZjk1ZWNmMzg4MTJiMGFiY2Q3NGEzNWY3ZTUyZDRkMjZiNTJkZmI2ZmUwMWMxNCJ9.90467ae6c670e129b50f923cfc64a29b75fc4279c6a50c3dec9f9162983d622e',
    //     refresh_expires_in: 5184000
    //   }
  }

  // const isExistingAccount = await ConnectedAccount.findOne({ accountId: userInfo?.id });

  // if (isExistingAccount) {
  //   return redirect('/builder?integration=google');
  // }
};
