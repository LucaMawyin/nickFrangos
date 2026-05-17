"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/lib/types";
import Tile from "@/components/Tile"
import Button from "@/components/Button";


export default function CreateClient(props : {title:string; initialData? : any}){

  const router = useRouter();

  const [title, setTitle] = useState(props.initialData?.title ?? "");
  const [content, setContent] = useState(props.initialData?.content ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!props.initialData) return;

    setTitle(props.initialData.title ?? "");
    setContent(props.initialData.content ?? "");
    if (props.initialData.imageUrl) {
      setPreview(props.initialData.imageUrl);
      setExistingImage(props.initialData.imageUrl);
    }
  }, [props.initialData]);  

  const inputRef = useRef<HTMLInputElement>(null);
  const [ imageFile, setImageFile ] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"draft" | "publish">("draft");


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

    if (mode === "publish" && !imageFile && !existingImage) {
      setError("Image required for publishing");
      return;
    }

    // Data stored in one object
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("mode", mode);
    if (props.initialData?.id) {
      formData.append("id", props.initialData.id);
    }

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
        title={props.title}
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
            value={title}
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
            value={content}
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
            <Button 
              text="Select Image" 
              variant="secondary" 
              className="w-fit sm:w-48"
              onClick={() => inputRef.current?.click()} 
            />

            {preview && (
              <img src={preview} alt="Preview" />
            )}
          </div>
          

          {error && (
            <p className="text-red-500 text-sm mt-2">
              {error}
            </p>
          )}
          <div className="flex 
            flex-col 
            gap-2
            sm:flex-row justify-between">
            <Button
              text="Save Draft" 
              type="submit" 
              className="w-full sm:w-48"
              onClick={() => setMode("draft")}
            />
            <Button 
              text="Post" 
              type="submit" 
              className="w-full sm:w-48"
              onClick={() => setMode("publish")}
            />
            <Button
              text="Cancel"
              type="reset"
              variant="secondary"
              className="w-full sm:w-48"
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