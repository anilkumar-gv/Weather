"use client";

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  weather: string;
  windSpeed: number;
}

interface WeatherResultProps {
  data: WeatherData;
  description?: string;
}

export default function WeatherResult({ data, description }: WeatherResultProps) {
  const getTempColor = (temp: number) => {
    if (temp < 0) return "text-blue-600 dark:text-blue-400";
    if (temp < 15) return "text-cyan-600 dark:text-cyan-400";
    if (temp < 25) return "text-green-600 dark:text-green-400";
    if (temp < 35) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getWeatherIcon = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("rain")) return "🌧️";
    if (cond.includes("cloud")) return "☁️";
    if (cond.includes("clear") || cond.includes("sunny")) return "☀️";
    if (cond.includes("snow")) return "❄️";
    if (cond.includes("storm")) return "⛈️";
    return "🌤️";
  };

  return (
    <div className="my-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-6 backdrop-blur dark:border-emerald-700 dark:from-emerald-900/30 dark:to-teal-900/30">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {data.city}, {data.country}
          </h3>
          {description && (
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
              {description}
            </p>
          )}
        </div>
        <div className="text-5xl">{getWeatherIcon(data.weather)}</div>
      </div>

      {/* Temperature Section */}
      <div className="mb-6 rounded-lg border-2 border-emerald-200 bg-white/50 p-4 dark:border-emerald-700 dark:bg-emerald-900/20">
        <div className={`text-5xl font-bold ${getTempColor(data.temperature)}`}>
          {data.temperature.toFixed(1)}°C
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {((data.temperature * 9) / 5 + 32).toFixed(1)}°F
        </div>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-emerald-200 bg-white/50 p-3 dark:border-emerald-700 dark:bg-emerald-900/20">
          <div className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">
            Condition
          </div>
          <div className="mt-1 text-sm font-bold text-emerald-900 dark:text-emerald-100">
            {data.weather}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-white/50 p-3 dark:border-emerald-700 dark:bg-emerald-900/20">
          <div className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">
            Humidity
          </div>
          <div className="mt-1 text-sm font-bold text-emerald-900 dark:text-emerald-100">
            {data.humidity}%
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-white/50 p-3 dark:border-emerald-700 dark:bg-emerald-900/20">
          <div className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">
            Wind
          </div>
          <div className="mt-1 text-sm font-bold text-emerald-900 dark:text-emerald-100">
            {data.windSpeed} mph
          </div>
        </div>
      </div>
    </div>
  );
}
