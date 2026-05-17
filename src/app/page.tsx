"use client";

import { useEffect, useState } from "react";
import "./global.css";
import Title from "@/components/Title"
import Button from "@/components/Button"
import Icon from "@/components/Icon";
import About from "@/components/About";
import { YouTubeResponse } from "@/lib/types";

export default function Home() {

  const [loaded, setLoaded] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));

      if (!sections.length) return;

      const observer = new IntersectionObserver(
          () => {
              let bestSection: HTMLElement | null = null;
              let bestRatio = 0;

              for (const section of sections) {
                  const rect = section.getBoundingClientRect();

                  const height = window.innerHeight;
                  const visibleHeight =
                      Math.min(rect.bottom, height) - Math.max(rect.top, 0);

                  const ratio = Math.max(0, visibleHeight / height);

                  if (ratio > bestRatio) {
                      bestRatio = ratio;
                      bestSection = section;
                  }
              }

              if (bestSection?.id && bestRatio > 0.4) {
                  window.history.replaceState(null, "", `#${bestSection.id}`);
              } else {
                  window.history.replaceState(null, "", "/");
              }
          },
          {
              threshold: [0, 0.1, 0.5, 1],
          }
      );

      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
  }, []);

  const links = {
    instagram: "https://www.instagram.com/niche_0805/",
    tiktok: "https://www.tiktok.com/@niche_0805",
    linkedin: "https://www.linkedin.com/in/nicholas-frangos-4b857432a/",
    email: "mailto:nicholas.frangos0@gmail.com",
  }

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
        className="snap-start
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
                  window.open("/resume.pdf", "_blank");
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

      <section id="about" className="snap-start">
        <About />
      </section>

      <section 
        id="media" 
        className="
          snap-start 
          flex 
          items-start
          md:items-center
          justify-center 
          min-h-[75vh]
          md:min-h-[90vh]
      ">
        <div className="w-full max-w-4xl p-6">
          <h2 className="text-center md:text-start text-[3em] font-bold mb-[5%]">Check Out My Latest Video</h2>

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

