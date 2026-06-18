"use client";

interface TimezoneData {
  city: string;
  timezone: string;
  currentTime: string;
  currentDate: string;
}

interface TimezoneResultProps {
  data: TimezoneData;
  description?: string;
}

export default function TimezoneResult({
  data,
  description,
}: TimezoneResultProps) {
  return (
    <div className="my-4 rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50/80 to-cyan-50/80 p-6 backdrop-blur dark:border-teal-700 dark:from-teal-900/30 dark:to-cyan-900/30">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-teal-900 dark:text-teal-100">
          🌍 {data.city}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-teal-700 dark:text-teal-300">
            {description}
          </p>
        )}
      </div>

      {/* Time Display */}
      <div className="mb-6 rounded-lg border-2 border-teal-200 bg-white/50 p-6 dark:border-teal-700 dark:bg-teal-900/20">
        <div className="text-6xl font-bold text-teal-600 dark:text-teal-400">
          {data.currentTime}
        </div>
        <div className="mt-2 text-lg text-gray-700 dark:text-gray-300">
          {data.currentDate}
        </div>
      </div>

      {/* Timezone Info */}
      <div className="rounded-lg border border-teal-200 bg-white/50 p-4 dark:border-teal-700 dark:bg-teal-900/20">
        <div className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">
          Timezone
        </div>
        <div className="mt-2 text-lg font-bold text-teal-900 dark:text-teal-100">
          {data.timezone}
        </div>
      </div>
    </div>
  );
}
