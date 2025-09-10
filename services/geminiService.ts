import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI with apiKey from environment variables as per guidelines.
// This assumes `process.env.API_KEY` is available in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Enhances a user-provided prompt using the Gemini API to make it more descriptive for image generation.
 * @param prompt The initial prompt string.
 * @returns A promise that resolves to the enhanced prompt string.
 */
export const enhancePrompt = async (prompt: string): Promise<string> => {
  if (!prompt) {
    return "";
  }
  try {
    // Fix: Use the recommended model 'gemini-2.5-flash' for text tasks.
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are an expert in writing creative and detailed prompts for AI image generation. 
    Enhance the following user-provided prompt to make it more vivid, descriptive, and suitable for generating a high-quality, artistic image. 
    Focus on adding details about composition, lighting, art style, and mood. The output should be only the enhanced prompt text, without any preamble or explanation.`;
    
    // Fix: Use ai.models.generateContent to generate content.
    const response = await ai.models.generateContent({
        model: model,
        contents: `Enhance this prompt: "${prompt}"`,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    // Fix: Correctly access the generated text using the .text property on the response.
    const enhancedPrompt = response.text;
    return enhancedPrompt.trim();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt with AI.");
  }
};

/**
 * Generates an image based on a prompt using the Gemini API.
 * @param prompt The prompt to generate an image from.
 * @returns A promise that resolves to a base64-encoded image data URL.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  if (!prompt) {
    throw new Error("Prompt cannot be empty.");
  }
  try {
    // Fix: Use the recommended model 'imagen-4.0-generate-001' for image generation.
    const model = 'imagen-4.0-generate-001';
    
    // Fix: Use ai.models.generateImages for image generation as per the guidelines.
    const response = await ai.models.generateImages({
        model: model,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        // Fix: Correctly access the base64 image bytes from the response object.
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("No image was generated.");
    }

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};
