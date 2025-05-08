import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/signup`,
      { name, email, password },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const setCookies = response.headers["set-cookie"];
    if (setCookies && setCookies.length > 0) {
      const target_token = setCookies[0].split(";")[0];
      const name = target_token.split("=")[0];
      const value = target_token.split("=")[1];

      const res = NextResponse.json({ message: "success" });

      res.cookies.set({
        name: name,
        value: value,
        httpOnly: false,
        secure: true,
        sameSite: "strict",
        maxAge: 300,
      });

      return res;
    }

    return NextResponse.json({ error: "Cookie missing" }, { status: 500 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(
      "Signup error:",
      err?.response?.data || err.message || "Something went wrong"
    );

    return NextResponse.json(
      { error: err?.response?.data?.message || "Something went wrong" },
      { status: err?.response?.status || 500 }
    );
  }
}
