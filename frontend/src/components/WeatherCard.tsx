import Clock from "./Clock";
import type { WeatherData } from "@/types/weather";

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const locationLabel = weather.region
    ? `${weather.city}, ${weather.region}, ${weather.country}`
    : `${weather.city}, ${weather.country}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 backdrop-blur dark:from-emerald-900/40 dark:to-teal-900/40">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
            🔎 City weather
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-50">
            {locationLabel}
          </h2>
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
            Timezone: <span className="font-semibold text-emerald-900 dark:text-emerald-100">{weather.timezone}</span>
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-white/80 p-4 text-center dark:border-emerald-700 dark:bg-emerald-950/40">
          <Clock
            label="Local time"
            showDate={false}
            timeZone={weather.timezone}
            className="mx-auto"
            timeClassName="text-4xl"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-6xl font-bold text-teal-600 dark:text-teal-300">
            {Math.round(weather.temperature)}°C
          </p>
          <p className="mt-2 text-lg font-medium text-emerald-700 dark:text-emerald-200">
            {weather.condition}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/70 p-4 backdrop-blur dark:bg-emerald-950/40">
            <p className="text-2xl">💧</p>
            <dt className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">Humidity</dt>
            <dd className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-50">
              {weather.humidity}%
            </dd>
          </div>
          <div className="rounded-xl bg-white/70 p-4 backdrop-blur dark:bg-emerald-950/40">
            <p className="text-2xl">💨</p>
            <dt className="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">Wind</dt>
            <dd className="mt-1 text-xl font-bold text-emerald-900 dark:text-emerald-50">
              {Math.round(weather.windSpeed)} km/h
            </dd>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/50 px-4 py-2 dark:bg-emerald-950/30">
        <span className="text-sm text-emerald-600 dark:text-emerald-300">✓</span>
        <p className="text-xs text-emerald-700 dark:text-emerald-200">
          Data refreshes hourly from Open-Meteo
        </p>
      </div>
    </article>
  );
}

function WeatherCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:from-emerald-900/40 dark:to-teal-900/40"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-emerald-200 dark:bg-emerald-700" />
      <div className="mt-4 h-8 w-48 animate-pulse rounded bg-emerald-200 dark:bg-emerald-700" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="h-16 w-32 animate-pulse rounded bg-emerald-200 dark:bg-emerald-700" />
          <div className="mt-4 h-6 w-40 animate-pulse rounded bg-emerald-200 dark:bg-emerald-700" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-xl bg-emerald-200 dark:bg-emerald-700" />
          <div className="h-24 animate-pulse rounded-xl bg-emerald-200 dark:bg-emerald-700" />
        </div>
      </div>
    </div>
  );
}

WeatherCard.Skeleton = WeatherCardSkeleton;

export { WeatherCardSkeleton };
