"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
    const formData = new FormData();
    formData.append("description", input);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-top bg-slate-800">
      <h1 className="m-10 flex text-white font-bold font-biorhyme text-2xl tracking-wide">promptify</h1>
      <p className="mb-10 flex text-white font-bold font-biorhyme text-lg tracking-wide">write anything you want to get a music recommendation</p>
      <textarea
        className="p-1 h-24 w-96 bg-gray-50 rounded-lg text-black text-left"
        value={input}
        onChange={handleInputChange}
      />
      <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        className={`mt-5 flex items-center justify-center w-96 h-24 border-2 ${
          dragging ? "border-blue-500" : "border-dashed border-gray-400"
        } rounded-lg bg-white`}
      >
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput"/>
        <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer">
          <span className="text-gray-500">Drag and drop an image here, or click to select</span>
          {image && <p className="text-green-500 mt-2">{image.name}</p>}
        </label>
      </div>
      <button 
      onClick={handleSubmit} 
      className="mt-10 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        get recs
      </button>
    </main>
  );
}
