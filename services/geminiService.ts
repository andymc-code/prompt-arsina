import { GoogleGenAI, Type } from "@google/genai";

// For client-side applications built with Vite, environment variables
// must be prefixed with VITE_ and accessed via `import.meta.env`.
// This is required for deployment on platforms like Vercel.
const API_KEY = import.meta.env.VITE_API_KEY;

// Throw a clear, immediate error if the API_KEY is not configured correctly.
// This helps diagnose setup issues quickly.
if (!API_KEY) {
  // Remind the user to set up their .env file for local development
  // and to configure environment variables in their hosting provider.
  throw new Error("VITE_API_KEY is not set. Please add it to your .env file and configure it in your Vercel project settings.");
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

/**
 * Safely parses a JSON string that might be wrapped in markdown code fences.
 * @param jsonString The raw string from the Gemini API.
 * @returns The parsed JSON object.
 */
const robustJsonParse = (jsonString: string): any => {
    let cleanJsonString = jsonString.trim();
    const isJson = cleanJsonString.startsWith('```json');
    if (isJson || cleanJsonString.startsWith('```')) {
      cleanJsonString = cleanJsonString.substring(isJson ? 7 : 3, cleanJsonString.length - 3).trim();
    }
    return JSON.parse(cleanJsonString);
};

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
    
    const jsonResponse = robustJsonParse(response.text);
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

    const jsonResponse = robustJsonParse(response.text);
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