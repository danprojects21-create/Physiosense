
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { MorphoAnalysis } from "../types";

export async function analyzeFace(frontImage?: string | null, profileImage?: string | null): Promise<MorphoAnalysis> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-pro-preview';
  
  const parts: any[] = [];

  if (frontImage) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: frontImage.split(',')[1],
      },
    });
  }

  if (profileImage) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: profileImage.split(',')[1],
      },
    });
  }

  const imagesCount = parts.length;
  const contextText = imagesCount === 1 
    ? "Analiza este rostro basándote únicamente en esta perspectiva disponible. Indica que es un análisis preliminar."
    : "Analiza ambas perspectivas para un diagnóstico morfopsicológico completo.";

  parts.push({ text: contextText });

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });

  if (!response.text) throw new Error("Respuesta de IA vacía");
  return JSON.parse(response.text.trim());
}

export async function chatWithProfile(history: any[], message: string, profileSummary: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = 'gemini-3-pro-preview';
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `Eres un guía experto en autoconocimiento. Basándote en este diagnóstico: ${profileSummary}, responde al usuario con sabiduría y empatía.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}

export async function generateAudioSummary(text: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lee con voz cálida y profunda: ${text}` }] }],
    config: {
      responseModalities: ['AUDIO' as any],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
}
