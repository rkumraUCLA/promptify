<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
# Promptify - AI-Driven Music Recommendation App 🎵

Promptify is a unique web application that generates personalized music recommendations based on user input. Whether you provide a text description or an image, the app uses OpenAI's GPT models to create a tailored music experience using Spotify's vast music library.

## Features

- **Text Input:** Describe a scene, mood, or activity, and get music recommendations to match.
- **Image Input:** Upload a picture, and the AI analyzes the mood to suggest relevant songs.
- **Dynamic Music Suggestions:** Get song details like name, artist, and album cover with direct Spotify links.

## Tech Stack

- **Frontend:** React (Next.js) with Tailwind CSS for responsive design.
- **APIs Used:** 
  - **OpenAI API:** To process text and image inputs, generating appropriate song parameters.
  - **Spotify API:** To fetch song recommendations based on the parameters provided by OpenAI.
  
## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/promptify.git
   cd promptify

2. Install Dependencies
   ```bash
    npm install

3. Create a `.env/` file and add your OpenAI and Spotify API credentials:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

4. Run the development server
    ```bash
    npm run dev

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
1. Choose Input Type: Click on "Write me a sentence" for text input or "Upload a pic" for image input.
3. Get Recommendations: Click "Get Recs" to fetch songs based on your input.