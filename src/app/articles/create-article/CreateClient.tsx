"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/lib/types";
import Tile from "@/components/Tile"
import Button from "@/components/Button";


export default function CreateClient(){

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ imageFile, setImageFile ] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);


  // Handling thumbnail for post
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e : React.FormEvent){
    e.preventDefault();

    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    // Data stored in one object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (imageFile) { 
      formData.append("image", imageFile);
      formData.append("imageType", imageFile.type);
    }

    const response = await fetch("/api/articles", {
      method:"POST",
      body:formData,
    });

    // Successful publish reroutes to articles
    if (response.ok) {
      setError(null);
      router.push("/articles");
    } 

    // Somehow access is gained but not logged in
    else if (response.status == 401){
      router.push("/login");
    }

    // Default
    else {
      const data = await response.json() as LoginResponse;
      setError(data.error || "Failed to create article");
    }

  }

  // Image drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div 
      className="flex justify-center items-center min-h-[90vh]"
    >
      <Tile 
        title="Create a New Article"
        disableHover={true}
        className="lg:max-w-[40vw] max-w-full"
        >
        <form 
          className="
            w-full
            flex flex-col
            justify-center
            gap-3"
          onSubmit={handleSubmit}
        >
          <label htmlFor="title">Title</label>
          <input 
            id="title"  
            type="text" 
            name="title" 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write an interesting title" 
            required
          />

          <label htmlFor="content">Content</label>
          <textarea 
            id="content" 
            className="min-h-75"
            name="content" 
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your article" 
            required
          />
          
          
          <div
            onDragOver={(e) => {e.preventDefault()}}
            onDrop={handleDrop}
            className="flex flex-col gap-3"
          >
            <label htmlFor="thumbnail">Drag & drop an image here, or click to select</label>
            <input 
              id="thumbnail"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              ref={inputRef}
              className="hidden"
            />            
            <Button text="Select Image" variant="secondary" onClick={() => inputRef.current?.click()} />
          </div>
          
          {preview && (
            <img src={preview} alt="Preview" />
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
          <div className="flex 
            flex-col 
            gap-2
            sm:flex-row sm:items-center sm:self-end">
            <Button 
              text="Post" 
              type="submit" 
              className="w-full sm:w-32"
            />
            <Button
              text="Cancel"
              type="reset"
              variant="secondary"
              className="w-full sm:w-32"
              onClick={() => {
                router.push("/articles");
              }}
            />
          </div>
        </form>
      </Tile>

    </div>
  )
}