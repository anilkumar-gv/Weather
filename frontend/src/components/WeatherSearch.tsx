"use client";

import { FormEvent, useState } from "react";

interface WeatherSearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  defaultCity?: string;
}

export default function WeatherSearch({
  onSearch,
  isLoading,
  defaultCity = "",
}: WeatherSearchProps) {
  const [city, setCity] = useState(defaultCity);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(city);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="city-search" className="sr-only">
        City name
      </label>
      <input
        id="city-search"
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        placeholder="Enter a city (e.g. London)"
        className="w-full rounded-lg border border-emerald-300 bg-white px-4 py-3 text-emerald-900 shadow-sm outline-none ring-teal-500 placeholder:text-emerald-500 focus:ring-2 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-50 dark:placeholder:text-emerald-400"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition hover:from-teal-500 hover:to-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-[140px]"
      >
        {isLoading ? "🔍 Searching..." : "🔍 Search"}
      </button>
    </form>
  );
}
