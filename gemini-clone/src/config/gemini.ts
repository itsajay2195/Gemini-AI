// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from "@google/genai";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callGeminiApiWithFetch(
  prompt: string,
  retries = 3,
  retryDelay = 5000
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`; // Or gemini-2.0-flash as per your curl

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // console.log(`Sending API request via fetch (attempt ${attempt})...`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Handle HTTP errors (e.g., 400, 429, 500)
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        const errorMessage =
          errorData.error?.message || "Unknown API error occurred.";

        if (response.status === 429 || errorMessage.includes("quota")) {
          throw new Error(
            `Rate limit or quota error (${response.status}): ${errorMessage}`
          );
        } else {
          throw new Error(`HTTP error ${response.status}: ${errorMessage}`);
        }
      }

      const data = await response.json();
      // console.log("Gemini API Response:", data);

      // The `generateContent` endpoint (without `Stream`) returns the full response at once.
      // The text content is usually in data.candidates[0].content.parts[0].text
      if (data && data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "No text content found in response.";
      }
    } catch (error: any) {
      const isQuotaError =
        error.message?.includes("Rate limit") ||
        error.message?.includes("quota") ||
        error.message?.includes("Resource has been exhausted");

      if (attempt < retries && isQuotaError) {
        console.warn(
          `Attempt ${attempt} failed due to rate limit. Retrying in ${
            retryDelay / 1000
          }s...`
        );
        await delay(retryDelay);
        retryDelay *= 2; // Exponential backoff
      } else {
        console.error("callGeminiApiWithFetch failed:", error);
        throw error; // Re-throw the error after all retries fail
      }
    }
  }
  return null; // Should not reach here
}
