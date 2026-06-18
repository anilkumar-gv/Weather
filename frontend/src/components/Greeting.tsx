"use client";

import { useEffect, useState } from "react";
import { getGreeting } from "@/lib/greeting";

export default function Greeting() {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();
    const interval = setInterval(updateGreeting, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-3xl font-bold text-emerald-900 dark:text-white sm:text-4xl">
      {greeting}!
    </p>
  );
}
