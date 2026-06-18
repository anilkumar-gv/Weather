import { FORECAST_API_URL, GEOCODING_API_URL } from "./constants.js";
import { getWeatherLabel } from "./weatherCodes.js";
import type { WeatherData } from "../types/weather.js";

interface GeocodingResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
    timezone?: string;
  }>;
}

interface ForecastResult {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

export class WeatherError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    throw new WeatherError("Please enter a city name.", "INVALID");
  }

  const geoUrl = new URL(GEOCODING_API_URL);
  geoUrl.searchParams.set("name", trimmedCity);
  geoUrl.searchParams.set("count", "1");
  geoUrl.searchParams.set("language", "en");
  geoUrl.searchParams.set("format", "json");

  const geoResponse = await fetch(geoUrl.toString());
  if (!geoResponse.ok) {
    throw new WeatherError("Unable to look up city. Please try again.", "NETWORK");
  }

  const geoData = (await geoResponse.json()) as GeocodingResult;

  if (!geoData.results?.length) {
    throw new WeatherError(`City "${trimmedCity}" not found. Try another spelling.`, "NOT_FOUND");
  }

  const location = geoData.results[0];
  const forecastUrl = new URL(FORECAST_API_URL);
  forecastUrl.searchParams.set("latitude", String(location.latitude));
  forecastUrl.searchParams.set("longitude", String(location.longitude));
  forecastUrl.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m"
  );
  forecastUrl.searchParams.set("timezone", String(location.timezone || "auto"));

  const forecastResponse = await fetch(forecastUrl.toString());
  if (!forecastResponse.ok) {
    throw new WeatherError("Unable to fetch weather data. Please try again.", "NETWORK");
  }

  const forecastData = (await forecastResponse.json()) as ForecastResult;
  const { current } = forecastData;

  return {
    city: location.name,
    country: location.country,
    region: location.admin1,
    timezone: location.timezone || "UTC",
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    condition: getWeatherLabel(current.weather_code),
  };
}
