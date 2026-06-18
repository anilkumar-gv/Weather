export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone?: string;
}

export interface GeocodingResult {
  results?: GeocodingLocation[];
}

export interface ForecastCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface ForecastResult {
  current: ForecastCurrent;
}

export interface WeatherData {
  city: string;
  country: string;
  region?: string;
  timezone: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
}

export type WeatherErrorCode = "NOT_FOUND" | "NETWORK" | "INVALID";
