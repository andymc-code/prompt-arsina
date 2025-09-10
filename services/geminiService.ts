
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

export const generateImageWithAI = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '16:9',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No images were generated.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to communicate with the Gemini API for image generation.");
  }
};
