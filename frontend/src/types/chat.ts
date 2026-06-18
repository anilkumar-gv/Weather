// Chat message type
export interface Message {
  role: "user" | "assistant";
  content: string | object;
  timestamp: number;
  toolName?: string;
  toolData?: Record<string, unknown>;
}

// API request/response types
export interface ChatRequest {
  message: string;
  conversationHistory: Message[];
}

export interface ChatResponse {
  message: string | object;
}

// Agent tool input/output types
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

export interface TimezoneToolInput {
  city: string;
}

export interface TimezoneToolOutput {
  city: string;
  timezone: string;
  currentTime: string;
  currentDate: string;
}
