import { StoryOption, StyleOption } from "./types";

export const storyOptions: StoryOption[] = [
    { type: "preset", label: "Adventure Story" },
    { type: "preset", label: "Funny Story" },
    { type: "preset", label: "Scary Story" },
    { type: "preset", label: "Inspirational Story" },
    { type: "preset", label: "Romantic Story" },
    { type: "preset", label: "Sci-Fi Story" },
    { type: "preset", label: "Thriller Story" },
    { type: "custom", label: "Custom Prompt" },
   ];

   export const styleOptions: StyleOption[] = [
    { name: "Artistic" },
    { name: "Realistic" },
    { name: "Fantasy" },
    { name: "Dark",  },
    { name: "Water color" },
    { name: "GTA" },
    { name: "Comic" },
    { name: "Paint"}
   ];