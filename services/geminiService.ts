import { GoogleGenAI } from "@google/genai";

const parseGeminiError = (error: unknown): string => {
  if (error instanceof Error) {
    // Check for common client-side errors or specific API error messages
    if (error.message.includes('API key not valid')) {
      return 'The provided API Key is not valid. Please check the key and try again.';
    }
    if (error.message.includes('429')) { // Resource exhausted
      return 'You have exceeded your API quota. Please check your Google AI Studio account or try again later.';
    }
    // For generic errors, return the message
    return error.message;
  }
  return "An unknown error occurred while communicating with the Gemini API.";
}

export const enhancePromptWithAI = async (baseIdea: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please provide your API key to continue.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
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
    throw new Error(parseGeminiError(error));
  }
};