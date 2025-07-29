import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    // Replace with your actual authentication API endpoint
    const response = await fetch("YOUR_AUTH_API_ENDPOINT/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 400 })
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error with err:" + error }, { status: 500 })
  }
}
