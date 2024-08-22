import { NextResponse } from "next/server";
import OpenAI from "openai";

const gpt = new OpenAI();

export async function POST(req) {
  const res = NextResponse;
  const { params } = await req.json();

  // const response = await gpt.chat.completions.create({
  //   model: "gpt-3.5-turbo-0125",
  //   messages: [
  //     {
  //       role: "system",
  //       content: `You are a music recommender. I will give you a sentence. It could be a description of a place, a word, what a person may be doing. Your job is to recommend 3 songs back to them.`,
  //     },
  //     // {role: "user", content: "I'm at the beach."},
  //     // {role: "assistant", content: "You should listen to pop music, it would fit well with the beach vibes."},
  //     // {"role": "user", "content": "Where was it played?"}
  //     {
  //       role: "user",
  //       content: `${params.sentence}`,
  //     },
  //   ],
  // });

  // testing image 

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `I will give you an image. It could be an image of a place, a person, what a person may be doing. Your job is to give me only 5 adjectives based on this image.`,
      },
      {
        role: "user",
        content: [
          // {type: "text", text: "What’s in this image?"},
          {
            type: "image_url",
            image_url: {
              "url": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Anatomy_of_a_Sunset-2.jpg",
            },
          },
        ],
      }
    ],
  });

  return res.json({ result: response}, { status: 200 });
}
