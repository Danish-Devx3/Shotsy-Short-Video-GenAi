"use client";

import { handleDownload } from "@/actions/downloadVideo";
import Modal from "@/components/modal/modal";
import { VideoContext } from "@/context/VideoProvider";
import { storyOptions, styleOptions } from "@/lib/constants";
import RemotionPlayer from "@/remotion/remotionPlayer";
import { startTransition, useContext } from "react";

const CreateVideo = () => {
  const videoContext = useContext(VideoContext);
  const {
    selectedStory,
    selectedStyle,
    customPrompt,
    handleCustomPromptChange,
    handleSelectStory,
    handleSelectStyle,
    handleSubmit,
    loading,
    captions,
    images,
    audio,
  } = videoContext!;

  const handleDownloadVideo = async () => {
    startTransition(async()=>{
      try {
        const videoBuffer = await handleDownload();
        const blob = new Blob([videoBuffer], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "video.mp4";
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading video:", error);
      }
    })
  }
  
  return (
    <div className="grid bg-gradient-to-b from-neutral-300 via-neutral-200 to-gray-100 container mx-auto grid-cols-1 lg:grid-cols-2">
      <div className="px-6 pt-20  min-h-screen">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
          Create Your Video
        </h1>

        {/* Story Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Select a Story Type or Enter Custom Prompt
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {storyOptions.map((story) => (
              <div key={story.label} className="relative">
                {story.type === "custom" ? (
                  <>
                    <input
                      type="text"
                      id={story.label}
                      value={customPrompt}
                      onChange={(e) => handleCustomPromptChange(e as any)}
                      placeholder="Custom prompt"
                      className="peer block h-12 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
                    />
                  </>
                ) : (
                  <button
                    type="button"
                    className={`w-full h-12 rounded-md font-medium shadow-md transition-all duration-200 ${
                      selectedStory === story.label
                        ? "bg-neutral-600 text-white/70 "
                        : "outline-2 hover:bg-neutral-600 hover:text-white/60 text-neutral-600"
                    }`}
                    onClick={() => handleSelectStory(story.label)}
                  >
                    {story.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Style */}
        <div className="max-w-4xl mx-auto mt-14">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Select a Video Style
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {styleOptions.map((style) => (
              <div key={style.name}>
                <button
                  type="button"
                  className={`w-full h-12 rounded-xl font-medium shadow-md transition-all duration-200 ${
                    selectedStyle === style.name
                      ? "bg-neutral-600 text-white/70 "
                        : "outline-2 hover:bg-neutral-600 hover:text-white/60 text-neutral-600"
                  }`}
                  onClick={() => handleSelectStyle(style.name)}
                >
                  {style.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="max-w-2xl mx-auto mt-20">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !selectedStory ||
              !selectedStyle ||
              (selectedStory === "custom" && !customPrompt)
            }
            className="w-full bg-black md:w-1/2 mx-auto flex items-center justify-center h-14 rounded-2xl  text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-neutral-900/80 focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              "Create Video"
            )}
          </button>
        </div>

        <Modal />
      </div>

      <div className="flex items-center justify-center h-full">
        {captions && audio && images ? (
          <>
            <RemotionPlayer />
            <button className="mt-10 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300" onClick={handleDownloadVideo}>Download Video</button>
          </>
        ) : (
          <h2>No video data found</h2>
        )}
      </div>
    </div>
  );
};

export default CreateVideo;
