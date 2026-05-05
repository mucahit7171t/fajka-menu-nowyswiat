import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const username = body.username;
  const password = body.password;

  if (username === "admin" && password === "fajka2323") {
    return NextResponse.json({
      success: true,
      user: {
        username: "admin",
        role: "admin",
      },
      token: "fajka-local-admin-token",
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid username or password",
    },
    { status: 401 }
  );
}