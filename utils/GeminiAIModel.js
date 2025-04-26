// To run this code you need to install the following dependencies:
// npm install @google/genai mime

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const config = {
  responseMimeType: 'text/plain',
};

const model = 'gemini-2.0-flash-lite';

export const getAIResponse = async (inputText) => {
  const contents = [
    {
      role: 'user',
      parts: [{ text: inputText }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let finalResponse = '';
  for await (const chunk of response) {
    if (chunk.text) finalResponse += chunk.text;
  }

  return finalResponse;
};
