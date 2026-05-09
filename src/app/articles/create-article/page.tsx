"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"
import Form from "next/form"
import Tile from "@/components/Tile"
import Button from "@/components/Button";


export default function Create(){

  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for previewing
      setPreview(URL.createObjectURL(file));
    }
  };

  const inputClass = "border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div 
      className="flex justify-center items-center min-h-[90vh]"
    >
      <Tile 
        title="Create a New Article"
        disableHover={true}
        className="lg:max-w-[40vw] max-w-full"
        >
        <Form 
          className="
            w-full
            flex flex-col
            justify-center
            gap-3"
          action={()=>{}}
        >
          <label htmlFor="title">Title</label>
          <input 
            id="title" 
            className={inputClass} 
            type="text" 
            name="title" 
            placeholder="Write an interesting title" 
          />

          <label htmlFor="content">Content</label>
          <textarea 
            id="content" 
            className={`${inputClass} min-h-75`}
            name="content" 
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
        </Form>
      </Tile>

    </div>
  )
}