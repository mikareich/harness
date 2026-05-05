import { createGoogleGenerativeAI } from "@ai-sdk/google";

const AI_STUDIO_API_KEY = Deno.env.get("AI_STUDIO_API_KEY");

const google = createGoogleGenerativeAI({
  apiKey: AI_STUDIO_API_KEY,
});

export const GEMINI_3_FLASH_PREVIEW = google("gemini-3-flash-preview");

export const GEMINI_3_1_FLASH_LITE_PREVIEW = google(
  "gemini-3.1-flash-lite-preview",
);

export const GEMINI_3_1_PRO_PREVIEW = google("gemini-3.1-pro-preview");
