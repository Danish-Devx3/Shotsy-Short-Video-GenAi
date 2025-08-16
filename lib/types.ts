export type StoryOption = {
  type: "preset" | "custom";
  label: string;
};

export type StyleOption = {
  name: string;
};

export type VideoScript = {image: string; text: string}