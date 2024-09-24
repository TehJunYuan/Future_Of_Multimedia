import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, selectedVoice } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key is not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Text input is required", { status: 400 });
    }
    
    if (!selectedVoice) {
      return new NextResponse("Voice choice is required", { status: 400 });
    }

    const response = await openai.speech.audio.create({
      model: "tts-1",
      voice: selectedVoice,
      input: prompt,
    });

    console.log("OpenAI Response:", response);

    // Get the audio data from the response (hypothetical response format)
    const audioUrl = response.data.audio_url;

    return NextResponse.json({ audioUrl });
    
  } catch (error) {
    console.log("[TTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
