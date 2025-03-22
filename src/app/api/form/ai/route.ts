import { NextRequest, NextResponse } from 'next/server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { FORM_CRAFT_SYSTEM_PROMPT } from './prompt';
import { verifyAuth } from '@/backend/util';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  responseMimeType: 'application/json',
};

export const POST = async (req: NextRequest) => {
  try {
    const userId = await verifyAuth();

    if (!userId) {
      return NextResponse.json({
        message: 'Unauthorized',
        status: 401,
      });
    }

    const body = await req.json();

    const chat = model.startChat({
      generationConfig,
      history: [{ role: 'user', parts: [{ text: FORM_CRAFT_SYSTEM_PROMPT }] }],
    });

    const result = await chat.sendMessage(body.prompt as string);

    const json = JSON.parse(result?.response?.text());

    let res = json;

    if (Array.isArray(json) && json.length > 0) {
      json[0].createdBy = userId;
      res = json?.[0];
    } else if (res?.id) {
      res.createdBy = userId;
    }

    return NextResponse.json({
      message: 'Success',
      content: res,
    });
  } catch (error) {
    console.log('error', error);

    return NextResponse.json({
      message: 'Something went wrong',
      status: 500,
    });
  }
};
