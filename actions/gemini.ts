"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { rejects } from "assert";
import { v2 as cloudinary } from "cloudinary";
import { resolve } from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const defaultMessage =
  "Create a 30 second long ADVENTURE STORY video script. Include AI imageprompts in FANTASY FORMAT for each scene in realistic format. Provide the result in JSON format with 'image' and 'text' fields.";

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
              (error, result) => {
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
