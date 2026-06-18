interface LocationData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface IpInfoResponse {
  city?: string;
  country?: string;
  loc?: string;
}

interface GeoDbResponse {
  city?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
}

async function fetchIpInfoLocation(): Promise<LocationData> {
  const response = await fetch("https://ipinfo.io/json", {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`ipinfo.io returned ${response.status}`);
  }

  const data = (await response.json()) as IpInfoResponse;
  const [latitude, longitude] = (data.loc || "").split(",").map(Number);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw new Error("ipinfo.io did not return valid coordinates");
  }

  return {
    city: data.city || "Unknown",
    country: data.country || "",
    latitude,
    longitude,
  };
}

async function fetchGeoDbLocation(): Promise<LocationData> {
  const response = await fetch("https://geolocation-db.com/json/", {
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`geolocation-db.com returned ${response.status}`);
  }

  const data = (await response.json()) as GeoDbResponse;

  if (data.latitude == null || data.longitude == null) {
    throw new Error("geolocation-db.com did not return valid coordinates");
  }

  return {
    city: data.city || "Unknown",
    country: data.country_name || "",
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

export async function getLocationFromIP(): Promise<LocationData> {
  try {
    return await fetchIpInfoLocation();
  } catch (error) {
    console.warn("ipinfo.io lookup failed, trying geolocation-db.com:", error);
  }

  try {
    return await fetchGeoDbLocation();
  } catch (error) {
    console.warn("geolocation-db.com lookup failed:", error);
  }

  return {
    city: "Unknown",
    country: "",
    latitude: 0,
    longitude: 0,
  };
}
