import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

console.log("OpenAI Key:", process.env.OPEN_AI_KEY);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, selectedVoice} = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key is not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Input of Text are required", { status: 400 });
    }
    if (!selectedVoice) {
      return new NextResponse("Voice choice are required", { status: 400 });
    }

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice,
      input: prompt,
    });

    console.log("OpenAI Response:", response);

    return NextResponse.json(response);
    
  } catch (error) {
    console.log("[TTS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
