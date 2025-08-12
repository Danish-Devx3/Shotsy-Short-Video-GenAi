"use client";

import { createVideo, generateImage } from "@/actions/gemini";
import React, { createContext, ReactNode, useContext, useState } from "react";

const initialState = {
  script: "",
  images: [] as string[],
  captions: [] as object[],
  audio: "",
  loading: false,
  storyOptions: "funny story",
  styleOptions: "gta",
};

type VideoContextType = {
  script: string;
  images: string[];
  captions: object[];
  audio: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  setAudio: React.Dispatch<React.SetStateAction<string>>;
  setScript: React.Dispatch<React.SetStateAction<string>>;
  setCaptions: React.Dispatch<React.SetStateAction<object[]>>;
  selectedStory: string;
  selectedStyle: string;
  customPrompt: string;
  handleSelectStory: (story: string) => void;
  handleSelectStyle: (style: string) => void;
  handleCustomPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  loadingMessage: string;
};

export const VideoContext = createContext<VideoContextType | null>(null);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(initialState.loading);
  const [script, setScript] = useState(initialState.script);
  const [images, setImages] = useState(initialState.images);
  const [captions, setCaptions] = useState(initialState.captions);
  const [audio, setAudio] = useState(initialState.audio);
  const [selectedStory, setSelectedStory] = useState(initialState.storyOptions);
  const [selectedStyle, setSelectedStyle] = useState(initialState.styleOptions);
  const [customPrompt, setCustomPrompt] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleSelectStory = (story: string) => {
    setSelectedStory(story);
  };

  const handleSelectStyle = (style: string) => {
    setSelectedStyle(style);
  };

  const handleCustomPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCustomPrompt(e.target.value);
    setSelectedStory("custom");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Generating video...");

      const res = await createVideo(
        `Create a 30 second long ${
          selectedStory || customPrompt
        } video script. Include AI imageprompts for each scene in ${selectedStyle} format. Provide the result in JSON format with 'image' and 'text' fields.`
      );

      if (res.status === "error") {
        setLoadingMessage("Error generating video. Try again later.");

        return;
      } else {
        if (res.data.length >= 1) {
          setLoadingMessage("Generating images from script");
          console.log(res.data);
          // const scriptData = JSON.parse(res.data!);
          const scriptData = res.data;
          console.log("heyyy if")
          const imagePromises = scriptData.map(
            async (item: { image: string; text: string }) => {
              console.log("item in img promis", item)
              try {
                const imageRes = await generateImage(item.image);
                return imageRes;
              } catch (error) {
                console.log(error)
              }
            }
          );
          const imageResults = await Promise.all(imagePromises);
          const validImages = imageResults.filter(
            (img) => img !== undefined || img !== null
          );
          setImages(validImages);
        }
      }
    } catch (error) {
      console.log("Error in handleSubmit:", error);
      setLoadingMessage("Error generating images.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <VideoContext.Provider
      value={{
        script,
        images,
        captions,
        audio,
        loading,
        setLoading,
        setImages,
        setAudio,
        setScript,
        setCaptions,
        selectedStory,
        selectedStyle,
        customPrompt,
        handleSelectStory,
        handleSelectStyle,
        handleCustomPromptChange,
        handleSubmit,
        loadingMessage,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
