import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const apiKey = "AIzaSyDyblra5L5JLpAZrxWZxfmYfVfFpBjrTjM"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;
    return NextResponse.json({ text: aiText });
  } catch (error) {
    return NextResponse.json({ text: "ERROR: UPLINK_LOST" }, { status: 500 });
  }
}