import { NextResponse } from "next/server";

const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request: Request) {
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL not configured. Set BACKEND_URL in the environment." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let errorData: unknown = { error: responseText };
      if (contentType.includes("application/json")) {
        try {
          errorData = JSON.parse(responseText);
        } catch {
          // keep raw text if JSON parsing fails
        }
      }

      return NextResponse.json(errorData, { status: response.status });
    }

    if (contentType.includes("application/json")) {
      return NextResponse.json(JSON.parse(responseText), { status: response.status });
    }

    return new Response(responseText, {
      status: response.status,
      headers: { "content-type": contentType || "text/plain" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Backend proxy error.";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}
