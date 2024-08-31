"use client";

import { useState } from "react";
import { toBase64 } from "openai/core";

export default function Home() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [numSongs, setNumSongs] = useState(3); 
  const [recommendations, setRecommendations] = useState([]); 
  const [imageName, setImageName] = useState(""); 

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const resizeImage = (file, maxWidth, maxHeight, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        let width = img.width;
        let height = img.height;
  
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.7)); 
      };
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageName(file.name)
    if (file) {
      resizeImage(file, 800, 800, (resizedImage) => { 
        setImage(resizedImage);
      });
    }
  };  

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    const requestData = {
      params: {
        limit: numSongs,
        ...(inputType === "text" ? { sentence: input } : {}),
        ...(inputType === "image" && image ? { image: image } : {}),
      },
    };
  
    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log(data);

      setRecommendations(data.result);

    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  

  return (
    <>
      <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=SUSE:wght@100..800&display=swap');
          body {
          font-family: 'Suse', serif;
        }
      `}</style>
      <main className="flex min-h-screen flex-col items-center justify-top bg-black px-4 font-suse">
        <h1 className="mt-10 flex text-white font-bold text-4xl tracking-wide">promptify</h1>
        <p className="mt-6 mb-8 text-center text-white font-medium text-xl tracking-wide">find your next favorite track.</p>

        <div className="flex flex-row items-center space-x-4 mb-5">
          <button
            onClick={() => setInputType("text")}
            className={`w-40 h-20 px-6 py-3 rounded-lg ${
              inputType === "text" ? "bg-green-500 text-white" : "bg-gray-300"
            } hover:bg-green-700 hover:text-white transition-all duration-200`}
          >
            write me a sentence
          </button>
          <p className="text-white text-lg ">or</p>
          <button
            onClick={() => setInputType("image")}
            className={`w-40 h-20 px-6 py-3 rounded-lg ${
              inputType === "image" ? "bg-green-500 text-white" : "bg-gray-300"
            } hover:bg-green-700 hover:text-white transition-all duration-200`}
          >
            upload a pic
          </button>
        </div>

        {inputType === "text" ? (
          <textarea
            className="mt-3 p-3 h-24 w-full max-w-lg bg-gray-50 rounded-lg text-black text-left border border-gray-300"
            value={input}
            onChange={handleInputChange}
            placeholder="ex. I'm watching a sunset"
          />
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-3 flex items-center justify-center w-full max-w-lg h-24 border-2 ${
              dragging ? "border-blue-500" : "border-dashed border-gray-400"
            } rounded-lg bg-white`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer">
              {image && <p className="text-green-500 mt-2">{imageName} or Select Another</p>  || <span className="text-gray-500">Drag and drop an image here, or click to select</span>}
            </label>
          </div>
        )}

        <div className="mt-6">
          <label htmlFor="song-slider" className="text-white p-2">Number of songs:</label>
          <input
            type="number"
            min="1"
            max="12"
            value={numSongs}
            onChange={(e) => setNumSongs(e.target.value)}
            className="w-20 p-2 bg-white border border-gray-300 text-black rounded-lg"
          />
          <button
          onClick={handleSubmit}
          className="mx-10 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200"
          >
          Get Recs
          </button>
        </div>

        <div className="m-10 gap-x-10 gap-y-5 grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2">
          {recommendations.map((song, index) => (
            <div key={index} className="flex flex-col mb-10 items-center">
              <a href={song.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={song.album.images[0].url} alt={song.name} className="w-64 h-64 rounded-lg transition-transform transform hover:scale-105 
             shadow-lg shadow-gray-800 hover:shadow-xl hover:shadow-blue-500/50 
             border border-gray-700" />
              </a>
              <div className="w-80 text-center">
                <p className="mt-6 text-gray-500 text-sm">{song.artists[0].name}</p>
                <p className="mt-2 text-white font-medium">{song.name}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );

}
