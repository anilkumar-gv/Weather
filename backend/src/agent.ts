import { Ollama } from "@langchain/ollama";
import { weatherTool } from "./lib/weatherTool.js";
import { timezoneTool } from "./lib/timezoneTool.js";
import type { Message } from "./types/chat.js";

let llm: Ollama | null = null;

function getLLM(): Ollama {
  if (llm) {
    return llm;
  }

  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "mistral";

  llm = new Ollama({
    baseUrl,
    model,
    temperature: 0.7,
  });

  return llm;
}

interface StructuredAgentContent {
  text: string;
  toolName: string;
  toolData: Record<string, unknown>;
}

function sanitizeFinalResponse(response: string): string {
  return response
    .split(/\r?\n/)
    .filter(
      (line) =>
        !/^(\s*)(TOOL:|INPUT:|Tool\s+".*"\s+returned:)/i.test(line) &&
        !/^\s*Now please provide a helpful response/i.test(line)
    )
    .join("\n")
    .trim();
}

export async function runAgent(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string | object }>
): Promise<{
  type: "text" | "structured";
  content: string | StructuredAgentContent;
}> {
  const model = getLLM();

  const systemPrompt = `You are a helpful weather and time assistant. 

Available tools:
1. get_weather: Use this to get current weather for any city. Provide the city name.
2. get_timezone: Use this to get current time and timezone for any city. Provide the city name.

When the user asks about weather or time in a location:
- Use the appropriate tool
- Then provide a helpful, conversational response with the data
- Do not mention internal tool calls, debug steps, or processing details in the final answer

Important: When you need to use a tool, output EXACTLY this format:
TOOL: [tool_name]
INPUT: [city name or parameter]

After you use a tool, I will provide the result in the next message.

Be conversational and helpful. Provide recommendations based on weather data.`;

  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content),
    })),
    {
      role: "user" as const,
      content: userMessage,
    },
  ];

  const initialResponse = await model.invoke(messages);
  const responseText =
    typeof initialResponse === "string"
      ? initialResponse
      : typeof initialResponse === "object" && initialResponse !== null && "content" in initialResponse
      ? String((initialResponse as Record<string, unknown>).content)
      : JSON.stringify(initialResponse);

  const toolMatch = responseText.match(/TOOL:\s*(\w+)\s*\nINPUT:\s*(.+?)(?:\n|$)/);

  if (toolMatch) {
    const toolName = toolMatch[1];
    const toolInput = toolMatch[2].trim();

    let toolResult: string;

    try {
      if (toolName === "get_weather") {
        toolResult = await weatherTool.invoke({ city: toolInput });
      } else if (toolName === "get_timezone") {
        toolResult = await timezoneTool.invoke({ city: toolInput });
      } else {
        toolResult = `Unknown tool: ${toolName}`;
      }
    } catch (error) {
      toolResult = `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }

    const messagesWithToolResult = [
      ...messages,
      {
        role: "assistant" as const,
        content: responseText,
      },
      {
        role: "user" as const,
        content: `Tool "${toolName}" returned: ${toolResult}\n\nNow please provide a helpful response to the user's question using this data.`,
      },
    ];

    const finalResponse = await model.invoke(messagesWithToolResult);
    const finalText = sanitizeFinalResponse(
      typeof finalResponse === "string"
        ? finalResponse
        : typeof finalResponse === "object" && finalResponse !== null && "content" in finalResponse
        ? String((finalResponse as Record<string, unknown>).content)
        : JSON.stringify(finalResponse)
    );

    try {
      const parsedResult = JSON.parse(toolResult);
      return {
        type: "structured",
        content: {
          text: finalText,
          toolName,
          toolData: parsedResult,
        },
      };
    } catch {
      return {
        type: "text",
        content: finalText,
      };
    }
  }

  return {
    type: "text",
    content: responseText,
  };
}
