export interface Message {
  role: "user" | "assistant";
  content: string | object;
}

export interface ChatRequest {
  message: string;
  conversationHistory: Message[];
}

export interface ChatResponse {
  message: string | object;
}

export interface WeatherToolInput {
  city: string;
}

export interface WeatherToolOutput {
  city: string;
  country: string;
  temperature: number;
  humidity: number;
  weather: string;
  windSpeed: number;
  timezone: string;
}

export interface TimezoneToolOutput {
  city: string;
  timezone: string;
  currentTime: string;
  currentDate: string;
}
