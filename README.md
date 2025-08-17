# Shotsy - AI Powered Short Video Generator

Shotsy is a web application that leverages the power of Generative AI to create short videos from user-provided text. It uses a combination of AI services to generate audio, subtitles, and video scenes.

## Features

- **Text-to-Speech:** Converts text into natural-sounding speech using Murf AI.
- **Transcription and Subtitles:** Generates subtitles from the audio using AssemblyAI.
- **Video Scene Generation:** Creates video scenes using Remotion.
- **AI-Powered Content:** Utilizes Google Gemini for AI-powered features.

## Technology Stack

- **Frontend:** Next.js (React)
- **Styling:** Tailwind CSS
- **Video Generation:** Remotion
- **AI Services:**
  - Google Gemini API
  - AssemblyAI API
  - Murf AI API

## Folder Structure

```
/
├── actions/                # Server-side actions for AI services
│   ├── assemblyai.ts       # AssemblyAI API calls
│   ├── gemini.ts           # Gemini API calls
│   └── murf.ts             # Murf AI API calls
├── app/                    # Next.js app directory
│   ├── dashboard/          # Dashboard pages
│   │   └── create-video/   # Page for creating videos
│   ├── globals.css         # Global CSS styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Reusable React components
│   ├── loader/
│   ├── modal/
│   └── navbar/
├── context/                # React context providers
│   └── VideoProvider.tsx   # Context for video state
├── lib/                    # Utility functions and constants
├── public/                 # Static assets
└── remotion/               # Remotion video components
    ├── index.ts
    ├── remotionPlayer.tsx
    ├── remotionVideo.tsx
    └── root.tsx
```

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Danish-Devx3/Shotsy-Short-Video-GenAi.git
   cd Shotsy-Short-Video-GenAi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of the project and add the following environment variables. You can get the API keys from the respective services.

   ```bash
   # .env.local
   GEMINI_API_KEY=your_gemini_api_key
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   MURF_API_KEY=your_murf_api_key
   ```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production build.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.