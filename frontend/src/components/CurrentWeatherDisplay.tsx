"use client";

import { useEffect, useState } from "react";
import Clock from "./Clock";
import { getCurrentWeatherData } from "@/lib/currentWeather";

interface CurrentWeatherData {
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  timezone: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  time: string;
}

interface CurrentWeatherDisplayProps {
  className?: string;
  inline?: boolean;
}

function getWeatherEmoji(weatherCode: number): string {
  if (weatherCode === 0 || weatherCode === 1) return "☀️";
  if (weatherCode === 2 || weatherCode === 3) return "☁️";
  if (weatherCode >= 45 && weatherCode <= 48) return "🌫️";
  if (weatherCode >= 51 && weatherCode <= 65) return "🌧️";
  if (weatherCode >= 71 && weatherCode <= 86) return "❄️";
  if (weatherCode >= 80 && weatherCode <= 82) return "🌧️";
  if (weatherCode >= 85 && weatherCode <= 86) return "❄️";
  if (weatherCode >= 95) return "⛈️";
  return "🌤️";
}

export default function CurrentWeatherDisplay({ className = "", inline = false }: CurrentWeatherDisplayProps) {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        const data = await getCurrentWeatherData();
        setWeather(data);
        setError(null);
      } catch (err) {
        console.error("Error loading current weather:", err);
        setError("Unable to load weather data");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className={`${inline ? "" : "border-b border-emerald-200/30 bg-gradient-to-r from-emerald-50 to-teal-50"} p-4 ${className}`}>
        <div className="mx-auto max-w-4xl">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            Loading current weather...
          </p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <div className={`${inline ? className : "border-b border-emerald-200/30 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-800/30 dark:from-emerald-950/50 dark:to-teal-950/50"}`}>
      <div className="mx-auto max-w-4xl">
        <div className="grid w-full gap-4 sm:grid-cols-[minmax(220px,_1fr)_minmax(260px,_1fr)_minmax(220px,_auto)] sm:items-center">
          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-emerald-400">
                Current Location
              </p>
              <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                {weather.location.city}, {weather.location.country}
              </p>
            </div>
          </div>

          {/* Time Display */}
          <div className="text-center">
            <Clock
              label="Current Time"
              showLabel={true}
              showDate={true}
              className="mx-auto"
              timeClassName="text-3xl"
              dateClassName="text-xs"
              timeZone={weather.timezone}
            />
            <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">
              Timezone: <span className="font-semibold text-emerald-900 dark:text-emerald-100">{weather.timezone}</span>
            </p>
          </div>

          {/* Weather Info */}
          <div className="grid w-full grid-cols-[auto_minmax(140px,_1fr)_auto] items-center gap-4 text-right">
            <div className="flex flex-col items-end">
              <p className="text-4xl font-extrabold text-emerald-900 dark:text-emerald-100">
                {weather.temperature}°C
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 text-sm text-emerald-700 dark:text-emerald-300">
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">
                {weather.weatherDescription}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
                  Humidity: {weather.humidity}%
                </span>
                <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900 dark:border-teal-700 dark:bg-teal-900/30 dark:text-teal-100">
                  💨 Wind: {weather.windSpeed} mph
                </span>
              </div>
            </div>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}
