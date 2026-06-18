"use client";

import { FormEvent, useRef, useState } from "react";

interface MessageInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export default function MessageInput({
  onSubmit,
  isLoading,
}: MessageInputProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const initializeSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const extWindow = window as any;
    const SpeechRecognition =
      extWindow.SpeechRecognition || extWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = event as any;
      let finalTranscript = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;

        if (e.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        setInput((prev) => (prev + finalTranscript).trim());
      }
    };

    recognition.onerror = (event: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = event as any;
      setIsRecording(false);

      if (e.error === "not-allowed") {
        alert(
          "Microphone access denied. Please enable microphone permissions for this website in your browser settings."
        );
      } else if (e.error === "no-speech") {
        alert("No speech detected. Please try again.");
      } else if (e.error === "network") {
        alert("Network error. Please check your connection.");
      } else {
        console.error("Speech recognition error:", e.error);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    return recognition;
  };

  const handleMicrophoneClick = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }

    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || isLoading) {
      return;
    }

    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but allow Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const event = new Event("submit", { bubbles: true });
        form.dispatchEvent(event);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-emerald-200/30 bg-white/50 p-4 backdrop-blur dark:border-emerald-800/30 dark:bg-emerald-950/50"
    >
      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about weather and time zones"
          disabled={isLoading}
          rows={1}
          className="flex-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-emerald-900 placeholder-emerald-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-50 dark:placeholder-emerald-400 dark:focus:ring-teal-700"
          style={{
            minHeight: "2.5rem",
            maxHeight: "8rem",
            resize: "vertical",
          }}
        />
        <button
          type="button"
          onClick={handleMicrophoneClick}
          disabled={isLoading}
          className={`rounded-lg px-3 py-2 font-semibold text-white transition-all ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 animate-pulse"
              : "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording ? "⏹️" : "🎙️"}
        </button>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2 font-semibold text-white hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed dark:from-teal-700 dark:to-emerald-700 dark:hover:from-teal-600 dark:hover:to-emerald-600"
        >
          {isLoading ? (
            <span className="inline-block animate-spin">⏳</span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
}
