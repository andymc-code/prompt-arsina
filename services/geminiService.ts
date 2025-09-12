import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use process.env.API_KEY as per coding guidelines, which resolves the TypeScript error with import.meta.env.
const API_KEY = process.env.API_KEY;

// Throw a clear, immediate error during development or build if the key is missing.
if (!API_KEY) {
  throw new Error("API_KEY is not set. Please add it to your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseGeminiError = (error: unknown): string => {
  if (error instanceof Error) {
    // Check for common client-side errors or specific API error messages
    if (error.message.includes('API key not valid')) {
      return 'The application is experiencing a configuration issue. The API key is invalid.';
    }
    if (error.message.includes('429')) { // Resource exhausted
      return 'You have exceeded your API quota. Please check your Google AI Studio account or try again later.';
    }
    // For generic errors, return the message
    return error.message;
  }
  return "An unknown error occurred while communicating with the Gemini API.";
}

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
    throw new Error(parseGeminiError(error));
  }
};

export const generateVideoScenes = async (description: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the following idea, generate 3 distinct and cinematic video scene prompts. Each prompt should be a detailed paragraph. Idea: "${description}"`,
      config: {
        systemInstruction: "You are a creative assistant for video directors. Your task is to generate compelling, visually rich scene descriptions based on a simple user idea. Focus on camera shots, lighting, character actions, and atmosphere. Provide 3 distinct variations.",
        temperature: 0.9,
        topP: 1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenes: {
              type: Type.ARRAY,
              description: "An array of 3 distinct video scene prompts.",
              items: {
                type: Type.STRING,
                description: "A detailed video scene prompt."
              }
            }
          }
        }
      }
    });
    
    const jsonResponse = JSON.parse(response.text.trim());
    if (jsonResponse && jsonResponse.scenes && Array.isArray(jsonResponse.scenes)) {
        return jsonResponse.scenes.slice(0, 3);
    } else {
        throw new Error("Invalid response format from AI. Expected { scenes: [...] }");
    }

  } catch (error) {
    console.error("Error generating video scenes:", error);
    throw new Error(parseGeminiError(error));
  }
};

export const generateExampleSceneIdeas = async (description: string): Promise<string[]> => {
  if (!description.trim()) return [];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on this user input, generate 2 short, inspirational example scene ideas to show what's possible. User input: "${description}"`,
      config: {
        systemInstruction: "You are an AI assistant providing quick, inspirational examples. Generate two distinct, one-sentence scene ideas based on the user's input. The goal is to spark creativity.",
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              description: "An array of 2 short scene ideas.",
              items: {
                type: Type.STRING,
                description: "A one-sentence inspirational scene idea."
              }
            }
          }
        }
      }
    });

    const jsonResponse = JSON.parse(response.text.trim());
    if (jsonResponse && jsonResponse.ideas && Array.isArray(jsonResponse.ideas)) {
        return jsonResponse.ideas.slice(0, 2);
    } else {
        return []; // Fail gracefully
    }
  } catch (error) {
    console.error("Error generating example ideas:", error);
    return []; // Don't throw an error for this non-critical feature
  }
};
