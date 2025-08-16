"use server";

import { AssemblyAI, SpeechModel } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!,
});

export const createCaption = async (audioUrl: string) => {
  try {
    // 1. Create transcript request
    const transcript = await client.transcripts.transcribe({
      audio_url: audioUrl,
      speech_model: "slam-1" as SpeechModel,
    });

    // 2. Poll until transcript is completed
    let result = await client.transcripts.get(transcript.id);
    while (result.status !== "completed" && result.status !== "error") {
      await new Promise((r) => setTimeout(r, 3000)); // wait 3s
      result = await client.transcripts.get(transcript.id);
    }

    if (result.status === "completed") {
      console.log(result.words);
      return result.words;
    }
  } catch (error) {
    console.error("Error in generating caption", error);
    return null;
  }
};
