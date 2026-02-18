import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

// Get API key from Vite environment variables
const getApiKey = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // Fallback for local development if manually defined
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env?.API_KEY) {
    // @ts-ignore
    return process.env.API_KEY;
  }

  return '';
};

const apiKey = getApiKey();
// Initialize safely - if no key, the service will return errors gracefully
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const askIslamicAssistant = async (question: string): Promise<string> => {
  if (!ai) return "عذراً، مفتاح الربط (API Key) غير متوفر. يرجى إضافته في إعدادات الاستضافة (VITE_API_KEY).";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // Updated to latest stable flash model
      contents: question,
      config: {
        systemInstruction: "أنت مساعد إسلامي ذكي، خلوق، وتجيب بدقة حسب المعتقدات الإسلامية الصحيحة.",
      }
    });
    return response.text || "عذراً، لم أتمكن من الحصول على إجابة.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالخدمة. يرجى المحاولة لاحقاً.";
  }
};

export const generateIslamicStory = async (topic: string, lang: Language): Promise<{title: string, content: string} | null> => {
  if (!ai) return null;
  
  const prompt = `Write a short, inspiring Islamic story about "${topic || 'a general islamic virtue'}". 
  Language: ${lang}. 
  Format: JSON with keys "title" and "content".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
  if (!ai) return null;

  const prompt = `Suggest a delicious Ramadan recipe (Iftar or Suhoor) using these ingredients: ${ingredients || 'general ramadan ingredients'}. 
  Language: ${lang}.
  Format: JSON with keys "title", "description", "ingredients" (array of strings).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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