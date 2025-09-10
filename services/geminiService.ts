import { GoogleGenAI } from "@google/genai";

// Initialize ai to null. We will create the instance only when needed.
let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client instance.
 * Throws an error if the API key is not configured.
 */
const getAiClient = () => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not configured. Please add it to your environment variables in your hosting provider (e.g., Vercel) and redeploy the application.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

export const enhancePromptWithAI = async (baseIdea: string): Promise<string> => {
  try {
    const aiClient = getAiClient(); // This will initialize the client or throw an error if the key is missing.
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Expand this basic idea into a highly detailed and creative prompt for an AI image generator. The prompt should be a single, cohesive paragraph. Base idea: "${baseIdea}"`,
      config: {
        systemInstruction: "You are an expert prompt engineer for AI image and video generators. Your task is to take a user's simple idea and transform it into a rich, descriptive, and imaginative prompt. Focus on vivid details, artistic styles, lighting, and composition. The output should be a single string of comma-separated clauses, not a list or a structured object.",
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Re-throw the original error to be displayed in the UI.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to communicate with the Gemini API for prompt enhancement.");
  }
};