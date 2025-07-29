// src/app/api/prompts/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 });
    }

    // Build query parameters
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });

    // Log fetch time
    console.log(`Fetching prompts at ${new Date().toISOString()} with params: ${params.toString()}\n`);
    
    const response = await fetch(`https://api.dev.jarvis.cx/api/v1/prompts?${params.toString()}`, {
      headers: {
        Authorization: authHeader,
        'x-jarvis-guid': '',
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch prompts" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}