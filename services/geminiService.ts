
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function improveBio(currentBio: string): Promise<string> {
  if (!currentBio) return "الرجاء كتابة نبذة أولاً.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك خبير في الموارد البشرية والتعليم، قم بتحسين النبذة الشخصية التالية لطالب بأسلوب احترافي وجذاب باللغة العربية: "${currentBio}". اجعلها ملهمة وتعكس طموح الطالب.`,
    });
    return response.text || currentBio;
  } catch (error) {
    console.error("Gemini Error:", error);
    return currentBio;
  }
}

export async function summarizeProject(details: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `لخص المشروع التعليمي التالي في جملتين مركزتين بأسلوب مهني: "${details}"`,
    });
    return response.text || details;
  } catch (error) {
    console.error("Gemini Error:", error);
    return details;
  }
}
