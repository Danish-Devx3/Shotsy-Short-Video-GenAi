"use client";

import { VideoContext } from "@/context/VideoProvider";
import { useContext } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const remotionVideo = ({ images = [], audio = "", captions = [] }) => {
  const ctx = useContext(VideoContext);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const {
    audio: audioUrl,
    images: videoImages,
    captions: videoCaptions,
  } = ctx!;
  const totalDuration =
    captions.length > 1
      ? Math.ceil((captions[captions.length - 1] as any).end / (1000 / 30) + 30)
      : 1;

  const currentCaption = () => {
    const currentTime = (frame / fps) * 1000;
    const caption = captions.find(
      (caption: any) =>
        currentTime >= caption.start && currentTime <= caption.end
    );
    return caption ? (caption as any).text : "";
  };

  const calculateOpacity = (
    index: number,
    frame: number,
    startFrame: number,
    endFrame: number
  ): number => {
    // Log values for debugging

    // Ensure frames are strictly increasing
    if (startFrame >= endFrame) {
      console.warn("Invalid frame range:", { startFrame, endFrame });
      return 1; // Default opacity
    }
    // Calculate input range for interpolation
    const inputRange = [startFrame, startFrame + 50, endFrame - 50, endFrame];
    // Ensure inputRange is strictly increasing
    const uniqueInputRange = Array.from(new Set(inputRange)).sort(
      (a, b) => a - b
    );
    return index === 0
      ? 1 // First image is fully visible
      : interpolate(frame, uniqueInputRange, [0, 1, 1, 0]);
  };

  console.log({ captions, totalDuration, imagesLength: images.length });


  return (
    <AbsoluteFill>
      {images.map((img, idx) => {
        const startTime = (idx * totalDuration) / images.length;
        const endTime = startTime + totalDuration;
        const opacity = calculateOpacity(idx, frame, startTime, endTime);
        return (
          <Sequence
            key={idx}
            from={(idx * totalDuration) / images.length}
            durationInFrames={totalDuration}
          >
            <Img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
                opacity: opacity,
              }}
            />

            <AbsoluteFill>
              <span className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500 text-3xl font-semibold text-shadow-neutral-800-50">
                {currentCaption()}
              </span>
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Audio src={audio} />
    </AbsoluteFill>
  );
};

export default remotionVideo;
