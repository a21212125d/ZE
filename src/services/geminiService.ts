import { GoogleGenAI } from "@google/genai";
import { BarberShop, GroundingChunk, LatLng } from "../types";

type LocationQuery = LatLng | string;

export const findNearbyBarbers = async (location: LocationQuery, minRating: number | null): Promise<{ summary: string; shops: BarberShop[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is missing. Please set the API_KEY environment variable.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let toolConfig: any = undefined;

  const ratingClause = minRating ? `with a rating of ${minRating} stars or higher` : 'highly-rated';

  if (typeof location === 'string') {
    prompt = `Find ${ratingClause} barber shops near ${location}. Provide a brief summary.`;
    // When searching by text, we don't provide lat/lng in the tool config.
  } else {
    prompt = `Find ${ratingClause} barber shops near my current location. Provide a brief summary.`;
    toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
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