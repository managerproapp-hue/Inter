import { GoogleGenAI } from "@google/genai";

// Note: In a production env, this key should be proxied. For this requirement, we access process.env directly.
// The user must have VITE_API_KEY set in their Vercel environment variables.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const enhanceText = async (text: string, context: string): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found");
    return "Error: Configura la API Key de Gemini para usar esta función.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Actúa como un experto consultor gastronómico y profesor de escuela de hostelería.
      
      Contexto del proyecto: ${context}
      
      Texto original del alumno:
      "${text}"
      
      Tarea: Mejora la redacción, hazla más profesional, corrige ortografía y sugiere una idea innovadora relacionada con sostenibilidad si es pertinente.
      Mantén el tono académico pero apasionado. Devuelve SOLO el texto mejorado, sin introducciones ni explicaciones extra.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error al conectar con la IA. Por favor intenta más tarde.";
  }
};

export const suggestConcept = async (zone: string): Promise<string> => {
  if (!apiKey) return "API Key no configurada.";
  
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Dame 3 ideas breves y creativas para un concepto de restaurante sostenible ubicado en la zona de ${zone}, Murcia. Formato lista.`,
    });
    return response.text || "";
  } catch (e) {
    return "Error al generar ideas.";
  }
}