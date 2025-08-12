import { createVideo } from "@/actions/gemini";
import Image from "next/image";

export default function Home() {
  createVideo()
  return (
    <div>
      <h1>Next Video</h1>
    </div>
  );
}
