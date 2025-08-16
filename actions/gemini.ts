"use server";

import { cloudinary } from "@/lib/utils";
import { GoogleGenAI, Modality } from "@google/genai";
import { rejects } from "assert";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const defaultMessage =
  `You are a JSON generator.

TASK:
Write a 30-second fantasy adventure story as an array of scenes.

OUTPUT RULES:
1. Output ONLY valid JSON. No markdown, no explanations, no comments.  
2. Each element MUST follow this schema exactly:
   {
     "image": "A cinematic fantasy image description (no prefixes like 'AI image prompt:', no style tags, no comic references, no 'Style:', no narrator notes).",
     "text": "Plain narration text only. No SOUND:, no timestamps, no narrator labels, no stage directions."
   }
3. The JSON must be an array of 3–5 scenes, enough for ~30 seconds of spoken narration.  
4. "image" should always describe a single cinematic fantasy scene (realistic, detailed, immersive).  
5. "text" should always be plain narration, flowing naturally like a story read aloud.  
6. Do not output extra fields, explanations, or formatting outside the JSON.  
7. If you cannot follow the schema, output: []  

EXAMPLE (correct):
[
  {
    "image": "Fantasy forest with glowing mushrooms, ancient stone ruins covered in vines, mist in the air, cinematic lighting, hyper-realistic",
    "text": "The young adventurer entered the forgotten woods, each step echoing with secrets of the past."
  },
  {
    "image": "A crystal river reflecting moonlight, magical creatures watching from the shadows, enchanted atmosphere",
    "text": "Legends spoke of a river that revealed hidden truths to those brave enough to cross."
  },
  {
    "image": "Towering mountain with a glowing peak, storm clouds swirling above, epic scale, realistic fantasy painting",
    "text": "At the journey’s end stood the mountain of fate, where destiny awaited the chosen one."
  }
]
`;

export const createVideo = async (message: string = defaultMessage) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });
    const text = response.text?.replace(/```json|```/g, "").trim();
    return {
      status: "success",
      data: text ? JSON.parse(text) : null,
    };
  } catch (error) {
    console.error("Error generating video:", error);
    return {
      status: "error",
      message: "Error generating video. Try again later.",
    };
  }
};

export const generateImage = async (prompts: string) => {
  try {
    let imageUrl = "";
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompts,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) {
        console.log("Text part:", part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData!, "base64");
        const uploadResponse = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", folder: "ai-images" },
              (error: any, result: any) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            )
            .end(buffer);
        });
        imageUrl = (uploadResponse as any).secure_url;
      }
    }
    return imageUrl;
  } catch (error) {
    console.error("Error generating images:", error);
    return {
      status: "error",
      message: "Error generating images. Try again later.",
    };
  }
};
