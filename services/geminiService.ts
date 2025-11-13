import { GoogleGenAI } from "@google/genai";
import { BarberShop, GroundingChunk, LatLng } from "../types";

export const findNearbyBarbers = async (location: LatLng, minRating: number | null): Promise<{ summary: string; shops: BarberShop[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = "Find highly-rated barber shops near my location. Provide a brief summary.";
  if (minRating) {
    prompt = `Find barber shops near my location with a rating of ${minRating} stars or higher. Provide a brief summary.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const summary = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    const shops: BarberShop[] = groundingChunks
      .filter(chunk => chunk.maps && chunk.maps.title && chunk.maps.uri)
      .map(chunk => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri,
      }));

    return { summary, shops };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to fetch barber shops. The API may be unavailable or the request failed.");
  }
};