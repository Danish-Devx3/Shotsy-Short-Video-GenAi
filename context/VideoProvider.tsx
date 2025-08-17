"use client";

import { createCaption } from "@/actions/assemblyai";
import { createVideo, generateImage } from "@/actions/gemini";
import { createAudio } from "@/actions/murf";
import { saveVideoToDB } from "@/actions/videoToDB";
import { VideoScript } from "@/lib/types";
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
      setLoadingMessage("Generating video");

      const res = await createVideo(
        `Create a 10 second long ${
          selectedStory || customPrompt
        } video script for speech generation in plain text no any narrator/timing/environment direction only text. Include AI image prompts for each scene in ${selectedStyle} format. Provide the result in JSON format with 'image' and 'text' fields.
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
]`
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

          const imagePromises = scriptData.map(async (item: VideoScript) => {
            console.log("item in img promis", item);
            try {
              const imageRes = await generateImage(item.image);
              return imageRes;
            } catch (error) {
              console.log(error);
            }
          });
          const imageResults = await Promise.all(imagePromises);
          const validImages = imageResults.filter(
            (img) => img !== undefined || img !== null
          );
          setImages(validImages);
          const audioUrl = await generateAudio(scriptData);
          const captions = await generateCaption(audioUrl!);

          if(scriptData && validImages && audioUrl && captions) {
            setLoadingMessage("Saving video into DB")
            await saveVideoToDB({
              videoScript: scriptData,
              images: validImages,
              captions,
              audioUrl,
            })
            setLoadingMessage("Video saved successfully")
          }
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

  const generateAudio = async (script: VideoScript[]) => {
    setLoading(true);
    setLoadingMessage("Generating audio from script");
    try {
      const scriptText = script.map((item) => item.text).join(" ");
      const audio = await createAudio(scriptText);
      if (audio) {
        setAudio(audio);
        return audio;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const generateCaption = async (audioUrl: string) => {
    setLoading(true);
    setLoadingMessage("Generating Caption from Audio");
    try {
      const transcript = await createCaption(audioUrl);
      if (transcript){
        setCaptions(transcript);
        return transcript
      } 
      
    } catch (error) {
      console.log(error);
      setLoadingMessage("An error occured while generating Captions");
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
