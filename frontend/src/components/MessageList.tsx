"use client";

import { Message } from "@/types/chat";
import { useEffect, useRef } from "react";
import WeatherResult from "./WeatherResult";
import TimezoneResult from "./TimezoneResult";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

interface StructuredMessage extends Message {
  toolName: string;
  toolData: Record<string, unknown>;
}

function isStructuredMessage(message: Message): message is StructuredMessage {
  return (
    typeof message.toolName === "string" &&
    message.toolData !== undefined &&
    typeof message.toolData === "object"
  );
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center text-emerald-600 dark:text-emerald-300">
          <p className="text-5xl mb-4">🌍</p>
          <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            Weather Dashboard
          </h3>
          <p className="mt-3 text-emerald-700 dark:text-emerald-300">
            Get real-time weather updates, global time zones, and activity insights
          </p>
          <div className="mt-6 rounded-lg border-2 border-emerald-200 bg-emerald-50/50 p-4 text-left dark:border-emerald-700 dark:bg-emerald-900/20">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Example queries:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
              <li>📍 &quot;What&apos;s the weather in London?&quot;</li>
              <li>📊 &quot;Compare weather in Paris and Berlin&quot;</li>
              <li>🕐 &quot;What time is it in Tokyo?&quot;</li>
              <li>🏃 &quot;Is it a good day to go running?&quot;</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div key={index}>
              {message.role === "user" ? (
                // User Query
                <div className="rounded-lg border-l-4 border-teal-500 bg-white/50 px-4 py-3 dark:bg-emerald-950/30">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">💬</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        You
                      </p>
                      <p className="mt-1 text-emerald-800 dark:text-emerald-200">
                        {typeof message.content === "string"
                          ? message.content
                          : JSON.stringify(message.content, null, 2)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Assistant Response - check if structured
                <>
                  {isStructuredMessage(message) ? (
                    <>
                      {message.toolName === "get_weather" && (
                        <WeatherResult
                          data={message.toolData as {
                            city: string;
                            country: string;
                            temperature: number;
                            humidity: number;
                            weather: string;
                            windSpeed: number;
                          }}
                          description={typeof message.content === "string" ? message.content : ""}
                        />
                      )}
                      {message.toolName === "get_timezone" && (
                        <TimezoneResult
                          data={message.toolData as {
                            city: string;
                            timezone: string;
                            currentTime: string;
                            currentDate: string;
                          }}
                          description={typeof message.content === "string" ? message.content : ""}
                        />
                      )}
                    </>
                  ) : (
                    // Text response fallback
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-700 dark:bg-emerald-900/20">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">✨</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                            Assistant
                          </p>
                          <p className="mt-1 text-emerald-800 dark:text-emerald-200 whitespace-pre-wrap break-words">
                            {typeof message.content === "string"
                              ? message.content
                              : JSON.stringify(message.content, null, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-700 dark:bg-emerald-900/20">
              <div className="flex items-center gap-3">
                <span className="text-lg">⏳</span>
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-300 animate-bounce"></div>
                  <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-300 animate-bounce delay-100"></div>
                  <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-300 animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-emerald-700 dark:text-emerald-300">
                  Processing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
