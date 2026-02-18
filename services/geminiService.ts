import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Safe access to API key to prevent "process is not defined" error in browser
const getApiKey = () => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
    // Check for Vite's import.meta.env as fallback
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
  } catch (e) {
    console.warn("Environment variable access failed");
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const askIslamicAssistant = async (question: string): Promise<string> => {
  if (!apiKey) return "عذراً، مفتاح API غير متوفر.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction: "أنت مساعد إسلامي ذكي.",
      }
    });
    return response.text || "عذراً، لم أتمكن من الحصول على إجابة.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال.";
  }
};

export const generateIslamicStory = async (topic: string, lang: Language): Promise<{title: string, content: string} | null> => {
  if (!apiKey) return null;
  
  const prompt = `Write a short, inspiring Islamic story about "${topic || 'a general islamic virtue'}". 
  Language: ${lang}. 
  Format: JSON with keys "title" and "content".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const text = response.text;
    if (text) return JSON.parse(text);
    return null;
  } catch (error) {
    console.error("Story generation error:", error);
    return null;
  }
};

export const generateRamadanRecipe = async (ingredients: string, lang: Language): Promise<{title: string, description: string, ingredients: string[]} | null> => {
  if (!apiKey) return null;

  const prompt = `Suggest a delicious Ramadan recipe (Iftar or Suhoor) using these ingredients: ${ingredients || 'general ramadan ingredients'}. 
  Language: ${lang}.
  Format: JSON with keys "title", "description", "ingredients" (array of strings).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const text = response.text;
    if (text) return JSON.parse(text);
    return null;
  } catch (error) {
    console.error("Recipe generation error:", error);
    return null;
  }
};