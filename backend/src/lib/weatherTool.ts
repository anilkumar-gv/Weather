import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { fetchWeatherByCity } from "./weather.js";
import type { WeatherToolOutput } from "../types/chat.js";

export const weatherTool = tool(
  async (input: { city: string }): Promise<string> => {
    const weather = await fetchWeatherByCity(input.city);

    const output: WeatherToolOutput = {
      city: weather.city,
      country: weather.country,
      temperature: weather.temperature,
      humidity: weather.humidity,
      weather: weather.condition,
      windSpeed: weather.windSpeed,
      timezone: weather.timezone,
    };

    return JSON.stringify(output, null, 2);
  },
  {
    name: "get_weather",
    description:
      "Get current weather information for a specific city. Returns temperature in Celsius, humidity percentage, weather condition, wind speed in km/h, and timezone.",
    schema: z.object({
      city: z.string().describe("City name to get weather for (e.g., 'London', 'Paris', 'Tokyo', 'New York')"),
    }),
  }
);
