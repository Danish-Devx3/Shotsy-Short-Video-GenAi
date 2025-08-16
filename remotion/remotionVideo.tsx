import { VideoContext } from "@/context/VideoProvider";
import { useContext } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RemotionVideo = () => {
  const ctx = useContext(VideoContext);
  if (!ctx) return null;

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { audio, images, captions } = ctx;

  // total video duration (in frames)
  const totalDuration =
    captions.length > 1
      ? Math.ceil(
          (captions[captions.length - 1] as any).end / (1000 / fps) + fps
        )
      : fps;

  // helper to get caption for current time
  const currentCaption = () => {
    const currentTime = (frame / fps) * 1000;
    const caption = captions.find(
      (cap: any) => currentTime >= cap.start && currentTime <= cap.end
    );
    return caption ? (caption as any).text : "";
  };

  return (
    <AbsoluteFill>
      {images.map((img, idx) => {
        // evenly divide duration among images
        const sceneDuration = Math.max(
          1,
          Math.floor(totalDuration / images.length)
        );
        const startTime = idx * sceneDuration;

        return (
          <Sequence
            key={idx}
            from={startTime}
            durationInFrames={sceneDuration}
          >
            <Img
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                margin: "auto",
              }}
            />

            <AbsoluteFill className="flex items-center justify-center">
              <h2 className="text-emerald-500 text-3xl text-center px-4">
                {currentCaption()}
              </h2>
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {audio && <Audio src={audio} />}
    </AbsoluteFill>
  );
};

export default RemotionVideo;
