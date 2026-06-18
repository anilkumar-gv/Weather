"use client";

import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ErrorMessage from "./ErrorMessage";
import type { Message } from "@/types/chat";

function loadInitialMessages(): Message[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem("chat_messages");
  if (saved) {
    try {
      return JSON.parse(saved) as Message[];
    } catch {
      console.warn("Failed to load chat history");
    }
  }

  return [];
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(loadInitialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClearMessages = () => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    localStorage.removeItem("chat_messages");
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (userMessage: string) => {
    setError(null);
    setIsLoading(true);

    // Add user message to UI immediately
    const userMsg: Message = {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Call API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
      const apiUrl = `${backendUrl}/api/chat`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { message: string | object };

      let assistantContent: string | object = "";
      let toolName: string | undefined;
      let toolData: Record<string, unknown> | undefined;

      if (
        typeof data.message === "object" &&
        data.message !== null &&
        "text" in data.message &&
        typeof (data.message as Record<string, unknown>).text === "string"
      ) {
        const payload = data.message as Record<string, unknown>;
        assistantContent = payload.text as string;
        toolName = payload.toolName as string | undefined;
        toolData = payload.toolData as Record<string, unknown> | undefined;
      } else {
        assistantContent = data.message;
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: assistantContent,
        timestamp: Date.now(),
        toolName,
        toolData,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Chat error:", err);

      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white dark:bg-emerald-950">
      {/* Header */}
      <header className="border-b border-emerald-200/30 bg-white/50 backdrop-blur dark:border-emerald-800/30 dark:bg-emerald-950/30">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h1 className="text-lg font-bold text-emerald-900 dark:text-emerald-50">
              Weather Assistant
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearMessages}
              className="rounded-full border border-emerald-200 bg-emerald-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-800 dark:border-emerald-700 dark:bg-emerald-700 dark:text-white dark:hover:bg-emerald-600"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-900 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100 dark:hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="border-t border-red-200/30 bg-white/50 px-4 py-2 backdrop-blur dark:border-red-900/30 dark:bg-emerald-950/50">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Input Area */}
      <MessageInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
