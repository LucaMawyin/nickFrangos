"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Article, LoginResponse } from "@/lib/types";
import Tile from "@/components/Tile"
import Button from "@/components/Button";
import resizeImage from "@/lib/resizeImage";
import Link from "next/link";


export default function CreateClient(props : {title:string; initialData? : any}){

  // 200 MB MAX FILE SIZE
  const MAX_SIZE = 0.2 * 1024 * 1024;

  const router = useRouter();

  const [title, setTitle] = useState(props.initialData?.title ?? "");
  const [content, setContent] = useState(props.initialData?.content ?? "");
  const [preview, setPreview] = useState<string | null>(null);

  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

  // Setting data if loading a draft that exists
  useEffect(() => {
    if (!props.initialData) return;

    setTitle(props.initialData.title ?? "");
    setContent(props.initialData.content ?? "");

    if (props.initialData.imageUrl) {
      setPreview(props.initialData.imageUrl);
    }
    
  }, [props.initialData]); 

  // Redirect to specific article if they press return
  const returnTo = props.initialData?.is_published ? `/articles/read/${props.initialData.slug}` : "/articles/create-article";

  const inputRef = useRef<HTMLInputElement>(null);
  const [ imageFile, setImageFile ] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveDraft, setSaveDraft ] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Handling thumbnail for post
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let finalFile = await resizeImage(file);

    while (finalFile.size > MAX_SIZE) {
      finalFile = await resizeImage(finalFile);
    }

    setError(null);
    setImageFile(finalFile);
    setPreview(URL.createObjectURL(finalFile));
  };

  // Image drop
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    let finalFile = await resizeImage(file);

    while (finalFile.size > MAX_SIZE) {
      finalFile = await resizeImage(finalFile);
    }

    setError(null);
    setImageFile(finalFile);
    setPreview(URL.createObjectURL(finalFile));
  };

    const pathname = usePathname()
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();

        const submitter = (
            e.nativeEvent as SubmitEvent
        ).submitter as HTMLButtonElement;

        const mode = submitter.value as "draft" | "publish";

        // User wants to publish but there is no image
        if (mode === "publish" && !imageFile && !props.initialData?.imageUrl) {
            setError("Image required for publishing");
            setFadeOut(false);

            // force reflow cycle
            requestAnimationFrame(() => {
                    setTimeout(() => {
                    setFadeOut(true);
                }, 2000);

                setTimeout(() => {
                    setError(null);
                    setFadeOut(false);
                }, 3000);
            });

            return;
        }

        // Data stored in one object
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("mode", mode);
        

        // If we already have an id we will add it to form
        if (props.initialData?.id) {
            formData.append("id", props.initialData.id);
        }

        // If we already have image we add it to form
        if (imageFile) { 
            formData.append("image", imageFile);
            formData.append("imageType", imageFile.type);
        }

        const response = await fetch("/api/articles", {
            method:"POST",
            body:formData,
        });

        let data: any = null;

        try {
            data = await response.json();
        }
        catch{
            data = null;
        }

        // Successful publish reroutes to articles
        if (response.ok) {
            setError(null);

            data = data as Article;

            // Redirect to page of article when published
            if (mode === "publish" && data?.slug) {
                router.push(`/articles/read/${data.slug}`);
            } 

            // Saving as draft
            else if (mode === "draft") {
                
                // We are saving an already published article i.e. unpublishing
                if (props.initialData?.is_published) {
                    router.push("/articles");
                    return;
                }

                else if (pathname == "/articles/create-article/create-new-article"){
                    router.push("/articles/create-article");
                    return;
                }

                setSaveDraft(true);
                setFadeOut(false);

                requestAnimationFrame(() => {

                    setTimeout(() => {
                        setFadeOut(true);
                    }, 2000);

                    setTimeout(() => {
                        setSaveDraft(false);
                        setFadeOut(false);
                    }, 3000);     

                });

            }

            else {
                console.log("HERE")
                router.push("/articles");
                return;
            }
        }

        // Somehow access is gained but not logged in
        else if (response.status == 401){
            router.push("/login");
        }

        else if (response.status == 409){

            console.log(data.error);
                        
            setFadeOut(false);
            setError(data.error || "Failed to create article");

            requestAnimationFrame(() => {
                    setTimeout(() => {
                    setFadeOut(true);
                }, 2000);

                setTimeout(() => {
                    setError(null);
                    setFadeOut(false);
                }, 3000);
            });           
        }

        // Default
        else {
            try{
                setFadeOut(false);
                setError(data.error || "Failed to create article");

                requestAnimationFrame(() => {
                        setTimeout(() => {
                        setFadeOut(true);
                    }, 2000);

                    setTimeout(() => {
                        setError(null);
                        setFadeOut(false);
                    }, 3000);
                });            
            }catch(err) {
                setFadeOut(false);
                const message = err instanceof Error ? err.message : "Failed to create article";

                setError(message);

                requestAnimationFrame(() => {
                        setTimeout(() => {
                        setFadeOut(true);
                    }, 2000);

                    setTimeout(() => {
                        setError(null);
                        setFadeOut(false);
                    }, 3000);
                });     
            }

        }

    }

  return (
    <div 
      className="flex justify-center min-h-[90vh]"
    >
      <div className="flex flex-col md:w-[40%] w-full max-w-full justify-center">
        <Link href={returnTo} className="self-start pt-4 pb-4 pl-6 md:pl-0">&lt; Return </Link>
        <Tile 
          title={props.title}
          disableHover={true}
          className=" max-w-full md:mb-6"
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
            <div className="flex justify-between">
              <label htmlFor="content">Content (Markdown)</label>
              <p className="text-gray-500">Word count: {wordCount}</p>
            </div>
            
            <textarea 
              id="content" 
              className="min-h-75 font-normal placeholder:font-medium"
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
            
            <div className="h-5">
              {saveDraft && (
                <p
                  className={`
                    text-green-500 
                    text-sm 
                    transition-opacity 
                    duration-500 
                    text-center
                    ${fadeOut ? "opacity-0" : "opacity-100"}
                  `}
                >
                  Successfully Saved Draft
                </p>
              )}

              {error && (
                <p
                  className={`
                    text-red-500 
                    text-sm 
                    transition-opacity 
                    duration-500 
                    text-center
                    ${fadeOut ? "opacity-0" : "opacity-100"}
                  `}
                >
                  {error}
                </p>
              )}
            </div>
            <div className="flex 
              flex-col 
              gap-2
              sm:flex-row justify-between">
              <Button
                text="Save as Draft" 
                type="submit" 
                name="mode"
                value="draft"
                className="w-full sm:w-48"
              />
              <Button 
                text="Post" 
                type="submit" 
                name="mode"
                value="publish"
                className="w-full sm:w-48"
              />
              <Button
                text="Cancel"
                type="reset"
                variant="secondary"
                className="w-full sm:w-48"
                onClick={() => {
                  router.push("/articles/create-article");
                }}
              />
            </div>
          </form>
        </Tile>     
      </div>   
    </div>
  )
}
