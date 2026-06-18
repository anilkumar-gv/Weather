interface LocationData {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface CurrentWeatherData {
  location: LocationData;
  timezone: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  time: string;
}

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

async function getLocationFromIpapi(): Promise<LocationData> {
  const response = await fetch("https://ipapi.co/json/", {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`ipapi.co returned ${response.status}`);
  }

  const data = await response.json();

  if (!data || data.latitude == null || data.longitude == null) {
    throw new Error("ipapi.co did not return valid coordinates");
  }

  return {
    city: data.city || data.region || "Unknown",
    region: data.region || "",
    country: data.country_name || "",
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

async function getLocationFromIpWhoIs(): Promise<LocationData> {
  const response = await fetch("https://ipwho.is/", {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`ipwho.is returned ${response.status}`);
  }

  const data = await response.json();

  if (!data || data.success === false) {
    throw new Error(`ipwho.is failed: ${data?.message || "unknown error"}`);
  }

  if (data.latitude == null || data.longitude == null) {
    throw new Error("ipwho.is did not return valid coordinates");
  }

  return {
    city: data.city || data.region || "Unknown",
    region: data.region || "",
    country: data.country || "",
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

async function getLocation(): Promise<LocationData> {
  try {
    return await getLocationFromIpapi();
  } catch (error) {
    console.warn("ipapi.co lookup failed, trying ipwho.is:", error);
  }

  try {
    return await getLocationFromIpWhoIs();
  } catch (error) {
    console.warn("ipwho.is lookup failed:", error);
  }

  return {
    city: "Unknown",
    region: "",
    country: "",
    latitude: 0,
    longitude: 0,
  };
}

async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<Omit<CurrentWeatherData, "location">> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
      {
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather");
    }

    const data = await response.json();
    const current = data.current;
    const timezone = data.timezone || "UTC";

    return {
      timezone,
      temperature: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      weatherDescription:
        WEATHER_CODES[current.weather_code] || "Unknown condition",
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

export async function getCurrentWeatherData(): Promise<CurrentWeatherData> {
  const location = await getLocation();
  const weather = await getCurrentWeather(location.latitude, location.longitude);

  return {
    location,
    ...weather,
  };
}
