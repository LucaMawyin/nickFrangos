"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"
import { LoginResponse } from "@/lib/types";
import Tile from "@/components/Tile"
import Button from "@/components/Button";


export default function Create(){

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);


  // Handling thumbnail for post
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for previewing
      setPreview(URL.createObjectURL(file));
    }
  };

  async function handleSubmit(e : React.FormEvent){
    e.preventDefault();
    const response = await fetch("/api/articles", {
      method:"POST",
      headers:{
        "Content-Type" : "application/json",
      },
      body:JSON.stringify({
        title,
        content,
      }),
    });

    if (response.ok) {
      router.push("/articles");
    } 
    else if (response.status == 401){
      router.push("/login");
    }
    else {
      const data = await response.json() as LoginResponse;
      alert(data.error || "Failed to create article");
    }

  }

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
          />

          <label htmlFor="content">Content</label>
          <textarea 
            id="content" 
            className="min-h-75"
            name="content" 
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your article" />
          
          <label htmlFor="thumbnail">Thumbnail</label>
          <input 
            id="thumbnail"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            ref={inputRef}
            className="hidden"
          />
          <Button text="Select Image" variant="secondary" onClick={() => inputRef.current?.click()} />
          {preview && (
            <img src={preview} alt="Preview" />
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