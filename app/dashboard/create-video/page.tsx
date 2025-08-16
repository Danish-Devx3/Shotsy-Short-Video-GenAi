"use client";

import Modal from "@/components/modal/modal";
import { VideoContext } from "@/context/VideoProvider";
import { storyOptions, styleOptions } from "@/lib/constants";
import RemotionPlayer from "@/remotion/remotionPlayer";
import { useContext } from "react";

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
  return (
    <div className="grid container mx-auto grid-cols-1 lg:grid-cols-2">
      <div className="px-6 pt-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen">
  <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900">
    🎬 Create Your Video
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
                placeholder="Enter your own prompt..."
                className="peer block h-12 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-sm shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              />
              <label
                htmlFor={story.label}
                className="absolute left-4 top-2.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-indigo-600 peer-focus:text-xs"
              >
                {story.label}
              </label>
            </>
          ) : (
            <button
              type="button"
              className={`w-full h-12 rounded-xl font-medium shadow-md transition-all duration-200 ${
                selectedStory === story.label
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-400"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
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
                ? "bg-orange-500 text-white ring-2 ring-orange-300"
                : "bg-orange-400 text-white hover:bg-orange-500"
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
      className="w-full md:w-1/2 mx-auto flex items-center justify-center h-14 rounded-2xl bg-emerald-500 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="animate-pulse">⏳ Generating...</span>
      ) : (
        "🚀 Create Video"
      )}
    </button>
  </div>

  <Modal />
</div>

      <div className="flex items-center justify-center h-full">
        {captions && audio && images ? (
          <RemotionPlayer />
        ) : (
          <h2>No video data found</h2>
        )}
      </div>
    </div>
  );
};

export default CreateVideo;
