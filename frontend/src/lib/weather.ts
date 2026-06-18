import { FORECAST_API_URL, GEOCODING_API_URL } from "@/lib/constants";
import { getWeatherLabel } from "@/lib/weatherCodes";
import type {
  ForecastResult,
  GeocodingResult,
  WeatherData,
  WeatherErrorCode,
} from "@/types/weather";

export class WeatherError extends Error {
  code: WeatherErrorCode;

  constructor(message: string, code: WeatherErrorCode) {
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

  let geoResponse: Response;

  try {
    geoResponse = await fetch(geoUrl.toString());
  } catch {
    throw new WeatherError(
      "Network error. Check your connection and try again.",
      "NETWORK",
    );
  }

  if (!geoResponse.ok) {
    throw new WeatherError(
      "Unable to look up city. Please try again.",
      "NETWORK",
    );
  }

  const geoData = (await geoResponse.json()) as GeocodingResult;

  if (!geoData.results?.length) {
    throw new WeatherError(
      `City "${trimmedCity}" not found. Try another spelling.`,
      "NOT_FOUND",
    );
  }

  const location = geoData.results[0];
  const forecastUrl = new URL(FORECAST_API_URL);
  forecastUrl.searchParams.set("latitude", String(location.latitude));
  forecastUrl.searchParams.set("longitude", String(location.longitude));
  forecastUrl.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
  );
  forecastUrl.searchParams.set("timezone", String(location.timezone || "auto"));

  let forecastResponse: Response;

  try {
    forecastResponse = await fetch(forecastUrl.toString());
  } catch {
    throw new WeatherError(
      "Network error while fetching weather. Please try again.",
      "NETWORK",
    );
  }

  if (!forecastResponse.ok) {
    throw new WeatherError(
      "Unable to fetch weather data. Please try again.",
      "NETWORK",
    );
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
    weatherCode: current.weather_code,
    condition: getWeatherLabel(current.weather_code),
  };
}
