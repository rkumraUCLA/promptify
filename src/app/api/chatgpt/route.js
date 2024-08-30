import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const gpt = new OpenAI();

export async function POST(req) {
  const { params } = await req.json();
  const inputType = params.image ? "image" : "text";
  console.log(params)

  // testing image 

  // const completion = await openai.chat.completions.create({
  //   model: "gpt-4o-mini",
  //   messages: [
  //     {
  //       role: "system",
  //       content: `I will give you an image. It could be an image of a place, a person, what a person may be doing. Your job is to give me only 5 adjectives based on this image.`,
  //     },
  //     {
  //       role: "user",
  //       content: [
  //         // {type: "text", text: "What’s in this image?"},
  //         {
  //           type: "image_url",
  //           image_url: {
  //             "url": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Anatomy_of_a_Sunset-2.jpg",
  //           },
  //         },
  //       ],
  //     }
  //   ],
  // });

  // const rec_info = JSON.parse(generatedData.choices[0].message.content)
  // console.log(NextResponse.json(gpt_response.choices[0].message.content));
  // return NextResponse.json({ gpt_response}, { status: 200 });


  // testing spotify
  const authToken = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authToken}`,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const genreResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const genres = genreResponse.data.genres
    
    const gptResponse = await gpt.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an assistant can handle an image or text input that generates JSON objects to be used with the Spotify Recommendations API. If given text, generate a JSON object for the Spotify API. If given an image, analyze its content and generate a JSON object based on the detected mood or theme. The JSON object should include the following fields: "limit": ${params.limit}, "market": US, "seed_genres": A comma-separated string of genres related to the mood or theme out of these genres available ${genres}, "target_acousticness": A float between 0 and 1 indicating the desired acousticness, "target_danceability": A float between 0 and 1 indicating the desired danceability, "target_energy": A float between 0 and 1 indicating the desired energy level, "target_instrumentalness": A float between 0 and 1 indicating the desired instrumentalness, "target_liveness": A float between 0 and 1 indicating the desired liveness, "target_tempo": Target tempo (BPM) (optional), "target_popularity": An integer between 0 and 100 indicating the desired popularity (optional). Generate a JSON object with these fields based on the input. If you deem any of them to be 0, don't include it. If the input has any information about the danceability, instrumentalness, or any other aspects of the song, recognize those and change it in the JSON.`
          ,
        },
        // {role: "user", content: "I'm at the beach."},
        // {role: "assistant", content: "You should listen to pop music, it would fit well with the beach vibes."},
        // {"role": "user", "content": "Where was it played?"}
        {
          role: "user",
          content: inputType === "image" ? `Analyze this image URL and provide JSON: ${params.image}` : params.sentence,
        },
      ],
    });

    const rawResponse = gptResponse.choices[0].message.content.trim();

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    const rec_info = JSON.parse(jsonMatch[0]);
    console.log(rec_info)

    const recResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params: rec_info,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // console.log(recResponse.data.tracks)

    return NextResponse.json(
      { result: recResponse.data.tracks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }

}
