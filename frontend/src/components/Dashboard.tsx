"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ErrorMessage from "@/components/ErrorMessage";
import Greeting from "@/components/Greeting";
import ThemeToggle from "@/components/ThemeToggle";
import CurrentWeatherDisplay from "@/components/CurrentWeatherDisplay";
import WeatherCard, { WeatherCardSkeleton } from "@/components/WeatherCard";
import WeatherSearch from "@/components/WeatherSearch";
import { APP_NAME } from "@/lib/constants";
import { fetchWeatherByCity, WeatherError } from "@/lib/weather";
import type { WeatherData } from "@/types/weather";

export default function Dashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = async (city: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await fetchWeatherByCity(city);
      setWeather(result);
    } catch (caught) {
      setWeather(null);
      if (caught instanceof WeatherError) {
        setError(caught.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-emerald-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-emerald-200/30 bg-white/50 backdrop-blur dark:border-emerald-800/30 dark:bg-emerald-950/30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌱</span>
            <h1 className="text-lg font-bold text-emerald-900 dark:text-emerald-50">
              {APP_NAME}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="rounded-lg border border-emerald-300 bg-white/70 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 backdrop-blur dark:border-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900"
              title="Open AI assistant"
            >
              🤖 AI Assist
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-2.5 sm:px-6">
        <div className="grid gap-5 grid-cols-1 h-full">
          {/* LEFT COLUMN: Input & Info */}
          <div className="flex flex-col justify-between space-y-2.5">
            {/* Badge & Greeting & Clock - Left Aligned in Card */}
            <div className="space-y-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 p-4 border border-emerald-200/50 dark:border-emerald-700/50 shadow-sm">
              <p className="inline-block rounded-full bg-emerald-200/70 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-800/70 dark:text-emerald-100">
                ✨ Weather Dashboard
              </p>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-emerald-900 dark:text-white">
                  <Greeting />
                </h2>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Local weather and conditions from your current location.
                </p>
              </div>
              <CurrentWeatherDisplay inline className="rounded-3xl bg-white/80 p-4 dark:bg-emerald-950/50 shadow-sm" />
            </div>

            {/* Search Section */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-50">
                🔍 Find Any City
              </h3>
              <div className="rounded-xl bg-white/70 p-2.5 backdrop-blur dark:bg-emerald-900/50">
                <WeatherSearch onSearch={handleSearch} isLoading={isLoading} />
              </div>
            </div>

            {/* Info Cards */}
            <div className="space-y-1">
              <div className="rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 p-2 dark:from-emerald-900/40 dark:to-teal-900/40">
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-800 dark:text-emerald-200">
                  <span className="font-semibold">💡 Live data</span>
                  <span>
                    from
                    <a
                      href="https://open-meteo.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 font-semibold underline hover:text-emerald-900 dark:hover:text-emerald-50"
                    >
                      Open-Meteo
                    </a>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    🌍
                    <span className="font-semibold">Updates hourly</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Weather Results */}
          <div className="flex flex-col justify-center">
            {/* Error Message */}
            {error && (
              <div className="mb-3">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div>
                <WeatherCardSkeleton />
              </div>
            )}

            {/* Weather Card */}
            {!isLoading && weather && (
              <div>
                <WeatherCard weather={weather} />
                <div className="mt-2 rounded-lg bg-gradient-to-r from-teal-100 to-emerald-100 p-2 dark:from-teal-900/40 dark:to-emerald-900/40">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                    ✨ Plan sustainable activities based on weather conditions
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-emerald-200/30 bg-white dark:border-emerald-800/30 dark:bg-emerald-950/20 py-2">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-emerald-700 dark:text-emerald-300 sm:px-6">
          <p>🌍 Stay informed, stay sustainable</p>
        </div>
      </footer>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ${
          isChatOpen ? "" : "hidden"
        }`}
        aria-hidden={!isChatOpen}
      >
        <div className="relative h-screen max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-emerald-950">
          <ChatInterface onClose={() => setIsChatOpen(false)} />
        </div>
      </div>
    </div>
  );
}
