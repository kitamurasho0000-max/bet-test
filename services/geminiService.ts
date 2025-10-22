import { GoogleGenAI, Type } from "@google/genai";
import type { BettingEvent } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const eventSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: 'A simple, exciting, binary-outcome sports event question. Example: "Will the striker score this penalty?"'},
        optionA_label: { type: Type.STRING, description: 'The first outcome label, a short, punchy word. Example: "Goal!"' },
        optionB_label: { type: Type.STRING, description: 'The second outcome label, a short, punchy word. Example: "Miss!"' },
        oddsA: { type: Type.NUMBER, description: 'The decimal odds for the first outcome. A plausible number between 1.1 and 5.0.' },
        oddsB: { type: Type.NUMBER, description: 'The decimal odds for the second outcome. A plausible number between 1.1 and 5.0.' },
        deadline: { type: Type.INTEGER, description: 'A short deadline in seconds for betting, between 10 and 30.'},
        category: { type: Type.STRING, description: 'The category of the event. Must be one of: "pk", "3pointer", "tennis", or "generic" if it doesn\'t fit.'}
    },
    required: ["question", "optionA_label", "optionB_label", "oddsA", "oddsB", "deadline", "category"]
};

export const generateNewEvent = async (): Promise<BettingEvent | null> => {
  if (!process.env.API_KEY) {
    console.error("Gemini API key is not configured.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a new, unique, and creative single-event sports betting scenario. Focus on a single, immediate action. Also provide a category for the event.",
      config: {
        responseMimeType: "application/json",
        responseSchema: eventSchema,
        temperature: 1.0,
      },
    });
    
    const jsonText = response.text;
    const eventData = JSON.parse(jsonText);

    const newEvent: BettingEvent = {
        id: `gemini-${Date.now()}`,
        question: eventData.question,
        category: eventData.category || 'generic',
        options: {
            'a': { label: eventData.optionA_label, odds: eventData.oddsA },
            'b': { label: eventData.optionB_label, odds: eventData.oddsB }
        },
        deadlineSeconds: eventData.deadline,
    };

    return newEvent;

  } catch (error) {
    console.error("Error generating event with Gemini:", error);
    return null;
  }
};