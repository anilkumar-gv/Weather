import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { TimezoneToolOutput } from "../types/chat.js";

async function getTimezoneForCity(city: string): Promise<TimezoneToolOutput> {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );

  if (!geoResponse.ok) {
    throw new Error(`Geocoding API failed: ${geoResponse.statusText}`);
  }

  interface GeoResult {
    results?: Array<{
      latitude: number;
      longitude: number;
      timezone: string;
      name: string;
      country: string;
    }>;
  }

  const geoData = (await geoResponse.json()) as unknown as GeoResult;

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`City not found: ${city}`);
  }

  const { latitude, longitude, timezone } = geoData.results[0];

  const now = new Date();

  return {
    city,
    timezone,
    currentTime: now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: timezone,
    }),
    currentDate: now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timezone,
    }),
  };
}

export const timezoneTool = tool(
  async (input: { city: string }): Promise<string> => {
    const result = await getTimezoneForCity(input.city);
    return JSON.stringify(result, null, 2);
  },
  {
    name: "get_timezone",
    description:
      "Get current time and timezone information for a specific city. Returns the timezone name, current time, and current date.",
    schema: z.object({
      city: z.string().describe("City name to get timezone and current time for (e.g., 'London', 'Tokyo')"),
    }),
  }
);
