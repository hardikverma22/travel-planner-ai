import {
  batch1Schema,
  batch2Schema,
  batch3Schema
} from "./schemas";

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const promptSuffix = "generate travel data according to the schema and in json format, do not return anything in your response outside of curly braces,";

const callOpenAIApi = (prompt: string, schema: any) => {
  return openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages: [
      { role: "system", content: "You are a helpful travel assistant." },
      { role: "user", content: prompt },
    ],
    functions: [{ name: "set_travel_details", parameters: schema }],
    function_call: { name: "set_travel_details" },
  });
}

export const generatebatch1 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  return callOpenAIApi(prompt, batch1Schema);
}

export const generatebatch2 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  return callOpenAIApi(prompt, batch2Schema);
}

export const generatebatch3 = (promptText: string) => {
  const prompt = `${promptText}, ${promptSuffix}`;
  return callOpenAIApi(prompt, batch3Schema);
}