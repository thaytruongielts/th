import { GoogleGenAI, Type } from "@google/genai";
import type { GrammarTopic, Exercise } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const exerciseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: {
        type: Type.STRING,
        enum: ["multiple-choice", "gap-filling", "short-answer"],
        description: "The type of the exercise."
      },
      question: {
        type: Type.STRING,
        description: "The exercise question. For gap-filling, use '____' for the blank."
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of options for multiple-choice questions. Empty for other types."
      },
      answer: {
        type: Type.STRING,
        description: "The correct answer for the exercise."
      },
    },
    required: ["type", "question", "answer"],
  },
};

export const generateExercises = async (topic: GrammarTopic): Promise<Exercise[]> => {
  try {
    const prompt = `
      You are an expert English grammar teacher creating practice exercises.
      Based on the following theory, generate 10 practice questions for an English learner.

      Grammar Topic: ${topic.name}
      Theory:
      ${topic.theory}

      Instructions:
      1. Create exactly 10 exercises.
      2. The exercises should be a mix of the following types: 'multiple-choice', 'gap-filling', and 'short-answer'.
      3. For 'gap-filling' questions, use '____' to indicate the blank.
      4. Ensure the questions directly test the provided theory.
      5. Return the output as a JSON array that strictly adheres to the provided schema. Do not include any other text or explanations outside of the JSON structure.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: exerciseSchema,
      },
    });

    const jsonText = response.text.trim();
    const generatedExercises = JSON.parse(jsonText) as Exercise[];
    
    // Basic validation
    if (!Array.isArray(generatedExercises) || generatedExercises.length === 0) {
        throw new Error("Invalid format received from API.");
    }

    return generatedExercises;

  } catch (error) {
    console.error("Error generating exercises:", error);
    throw new Error("Failed to generate exercises. Please check your API key and try again.");
  }
};