import OpenAI from "openai";
import { array } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTravelPlan(
  promptText: string,
  budget: number,
  season: string
) {
  const prompt = `${promptText}, ${season != "" &&
    `and the season is ${season} ${budget > 0 && `along with my budget ${budget}`
    }`
    } do not return anything in your response outside of curly braces,`;

  const schema = {
    type: "object",
    properties: {
      nameoftheplace: {
        type: "string",
        description: "Name of the user input place or location",
      },
      abouttheplace: {
        type: "string",
        description: "about the place in few lines",
      },
      thingstodo: {
        type: "array",
        description: "Different activities to do",
        items: { type: "string" },
      },
      topplacestovisit: {
        type: "array",
        description: "Top places to visit along with their coordinates",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the place" },
            coordinates: {
              type: "object",
              properties: {
                lat: { type: "number", description: "Latitude" },
                lng: { type: "number", description: "Longitude" },
              },
              required: ["lat", "lng"],
            },
          },
          required: ["name", "coordinates"],
        },
      },
      besttimetovisit: {
        type: "string",
        description: "Best time to visit",
      },
      localcuisinerecommendations: {
        type: "array",
        description: "Local Cuisine Recommendations",
        items: { type: "string" },
      },
      packingchecklist: {
        type: "array",
        description: "Packing Checklist",
        items: { type: "string" },
      },
      itinerary: {
        type: "array",
        description: "Itinerary for the specified number of days",
        items: {
          type: "object",
          properties: {
            title: { type: "string", description: "Day title" },
            activities: {
              type: "object",
              properties: {
                morning: {
                  type: "array",
                  items: { type: "string" },
                },
                afternoon: {
                  type: "array",
                  items: { type: "string" },
                },
                evening: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["morning", "afternoon", "evening"],
            },
          },
          required: ["title", "activities"],
        },
      }
    },
    "required": [
      "nameoftheplace",
      "abouttheplace",
      "thingstodo",
      "topplacestovisit",
      "besttimetovisit",
      "localcuisinerecommendations",
      "packingchecklist",
      "itinerary",],
  };
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
