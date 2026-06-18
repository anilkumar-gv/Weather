export interface WeatherData {
  city: string;
  country: string;
  region?: string;
  timezone: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

export class WeatherError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "WeatherError";
    this.code = code;
  }
}
