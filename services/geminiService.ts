import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhancePromptWithAI = async (baseIdea: string): Promise<string> => {
  try {
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
    throw new Error("Failed to communicate with the Gemini API for prompt enhancement.");
  }
};
