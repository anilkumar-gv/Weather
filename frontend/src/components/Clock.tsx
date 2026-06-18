"use client";

import { useEffect, useState } from "react";

interface ClockProps {
  label?: string;
  showLabel?: boolean;
  showDate?: boolean;
  className?: string;
  timeClassName?: string;
  dateClassName?: string;
  timeZone?: string;
}

function formatTime(date: Date, timeZone?: string): string {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });
}

function formatDate(date: Date, timeZone?: string): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone,
  });
}

export default function Clock({
  label = "Current Time",
  showLabel = true,
  showDate = true,
  className = "",
  timeClassName = "",
  dateClassName = "",
  timeZone,
}: ClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const timeoutId = window.setTimeout(update, 0);
    const intervalId = window.setInterval(update, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  if (!now) {
    return (
      <div className="space-y-2" aria-live="polite" aria-busy="true">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-emerald-200 dark:bg-emerald-700" />
        <div className="h-4 w-48 animate-pulse rounded bg-emerald-200 dark:bg-emerald-700" />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`} aria-live="polite">
      {showLabel && (
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
          ⏰ {label}
        </p>
      )}
      <p className={`font-mono text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-300 ${timeClassName}`}>
        {formatTime(now, timeZone)}
      </p>
      {showDate && (
        <p className={`text-xs font-medium text-emerald-700 dark:text-emerald-300 ${dateClassName}`}>
          {formatDate(now, timeZone)}
        </p>
      )}
    </div>
  );
}
