import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key is not configured", {
        status: 500,
      });
    }

    if (!audioFile) {
      return new NextResponse("Audio file is required", { status: 400 });
    }

    // Correct method for speech-to-text
    const response = await openai.audio.transcriptions.create({
      model: "whisper-1", // Use the appropriate model for speech-to-text
      file: audioFile,
    });

    const transcription = response.text; // Access the correct property for transcription

    return NextResponse.json({ transcription });
    
  } catch (error) {
    console.log("[STT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
