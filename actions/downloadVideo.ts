"use server"

import { PassThrough } from "stream";
import { renderMedia } from "@remotion/renderer";
import { Buffer } from "buffer";

export const handleDownload = async () => {
  const stream = new PassThrough();

  const chunks : Buffer[]=[];

  stream.on("data", (chunk) =>chunks.push(chunk));
    stream.on("end", () => {
        
    });
    await renderMedia({
    composition: "video", // your Remotion composition ID
    serveUrl: process.cwd(), // project root
    codec: "h264",
    outputLocation: null, // ✅ no file on disk
    // Instead of outputLocation, give it a stream
    output: stream,
    });
    return Buffer.concat(chunks);
};
