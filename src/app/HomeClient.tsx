"use client";

import { useEffect, useState } from "react";
import "./global.css";
import Title from "@/components/Title"
import Button from "@/components/Button"
import Icon from "@/components/Icon";
import About from "@/components/About";
import { SiteContent, YouTubeResponse } from "@/lib/types";
import { links } from "@/lib/links";

export default function Home(props : {
    content : SiteContent,
}) {

  const [loaded, setLoaded] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
      const sections = document.querySelectorAll("section[id]");

      const observer = new IntersectionObserver(
          (entries) => {
              const visible = entries
                  .filter(e => e.isIntersecting)
                  .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

              if (visible.length > 0) {
                  const id = visible[0].target.id;
                  window.history.replaceState(
                      null,
                      "",
                      id === "hero" ? "/" : `/#${id}`
                  );
              }
          },
          {
              threshold: 0.5
          }
      );

      sections.forEach((s) => observer.observe(s));

      return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function loadVideo() {
      const res = await fetch("/api/youtube");
      const data = await res.json() as YouTubeResponse;

      if (data.videoId) {
        setVideoId(data.videoId);
      }
    }

    loadVideo();
  }, []);

  return (

    <>
      <section
        id="hero"
        className="
        flex flex-row flex-wrap 
        justify-center items-center
        min-h-[90vh]">

        <div className="flex flex-row flex-wrap justify-center items-center">
          <div className={`flex flex-col px-[10%] pt-[10%]
            transition-all duration-800 ease-out
            ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >

            <div className="flex flex-row flex-wrap gap-5">
              {Object.entries(links).map(([name, url]) => (
                <Icon key={name} path={name} link={url} />
              ))}
            </div>

            <Title text="Hi" />
            <Title text="I'm Nicholas." />
            <Title text="Sports Media" />
            <div className="flex w-full p-[10%] justify-center md:justify-start md:pl-0">
              <Button 
                text="Resume" 
                onClick={() => {
                  window.open("/resume", "_blank");
                  return;
                }}
              />
            </div>
          </div>

          <div
            className="
              flex-[1_1_30%] 
              min-w-[30%] p-[2%] h-auto"
          >
            <img
              src="/images/headshot.jpg"
              alt="Headshot"
              className={`
                rounded-3xl
                duration-800 ease-out
                ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
            />
          </div>


        </div>
      </section>

      {/* ABOUT ME */}
      <section id="about">
        <About about={props.content.about}/>
      </section>

      <section 
        id="media" 
        className="
          flex 
          items-start
          md:items-center
          justify-center 
          min-h-[75vh]
          md:min-h-[80vh]
      ">
        <div className="w-full max-w-4xl p-6 pb-0">
          <h2 className="text-center text-[3em] font-bold mb-[5%]">Check Out My Latest Video</h2>

          {videoId ? (
            <iframe
              className="w-full aspect-video rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
            />
          ) : (
            <p>Loading video...</p>
          )}
        </div>
      </section>
    </>


  )
}

