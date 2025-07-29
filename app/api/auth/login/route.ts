import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Replace with your actual authentication API endpoint
    const response = await fetch("https://auth-api.dev.jarvis.cx/api/v1/auth/password/sign-in", {
      method: "POST",
      headers: {
        'X-Stack-Access-Type': 'client',
        'X-Stack-Project-Id': 'a914f06b-5e46-4966-8693-80e4b9f4f409',
        'X-Stack-Publishable-Client-Key': 'pck_tqsy29b64a585km2g4wnpc57ypjprzzdch8xzpq0xhayr',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userData = await response.json()
    return NextResponse.json(userData)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
