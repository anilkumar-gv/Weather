import type { ChatRequest } from "../types/chat.js";

export function validateChatRequest(body: unknown): ChatRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;

  if (typeof data.message !== "string" || !data.message.trim()) {
    throw new Error("Message is required and must be a non-empty string");
  }

  if (!Array.isArray(data.conversationHistory)) {
    throw new Error("conversationHistory must be an array");
  }

  const history = data.conversationHistory as Array<unknown>;
  for (const msg of history) {
    if (!msg || typeof msg !== "object") {
      throw new Error("Invalid message in conversation history");
    }

    const m = msg as Record<string, unknown>;
    if (typeof m.role !== "string" || (m.role !== "user" && m.role !== "assistant")) {
      throw new Error("Message role must be 'user' or 'assistant'");
    }

    if (typeof m.content !== "string" && typeof m.content !== "object") {
      throw new Error("Message content must be a string or object");
    }
  }

  if (history.length > 50) {
    throw new Error("Conversation history exceeds maximum length (50 messages)");
  }

  return {
    message: data.message.trim(),
    conversationHistory: history as ChatRequest["conversationHistory"],
  };
}
