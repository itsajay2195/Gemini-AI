// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChat(prompt: string, retries = 3, retryDelay = 5000) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  const config = {
    responseMimeType: "text/plain",
  };

  const model = "gemini-1.5-pro";
  const contents = [
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      console.log("response is>>>>", response);

      for await (const chunk of response) {
        console.log(chunk.text);
      }

      break; // success: exit loop
    } catch (error: any) {
      const isQuotaError =
        error?.status === 429 || error?.message?.includes("quota");

      if (attempt < retries && isQuotaError) {
        console.warn(
          `Attempt ${attempt} failed due to rate limit. Retrying in ${
            retryDelay / 1000
          }s...`
        );
        await delay(retryDelay);
        retryDelay *= 2; // Exponential backoff
      } else {
        console.error("runChat failed:", error);
        break;
      }
    }
  }
}

export default runChat;
