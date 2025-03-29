import { NextRequest, NextResponse } from 'next/server';
import { CLOUDINARY_UPLOAD_URL, UPLOAD_PRESET } from './config';

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        message: 'File is required',
        status: 400,
      });
    }

    // Prepare the data for Cloudinary upload
    const cloudinaryData = new FormData();
    cloudinaryData.append('file', file);
    cloudinaryData.append('upload_preset', UPLOAD_PRESET as string);

    const res = await fetch(CLOUDINARY_UPLOAD_URL, {
      body: cloudinaryData,
      method: 'POST',
    });

    const cloudinaryResponse = await res.json();

    return NextResponse.json({
      message: 'Success',
      status: 200,
      data: cloudinaryResponse,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      message: 'Could not upload file',
      status: 500,
    });
  }
};
