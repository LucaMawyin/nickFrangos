"use client";

import { useEffect, useState } from "react";
import "./global.css";
import Title from "@/components/Title"
import Button from "@/components/Button"
import Icon from "@/components/Icon";
import About from "@/components/About";

export default function Home() {

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const aboutSection = document.getElementById("about");

    if (!aboutSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.history.replaceState(null, "", "#about");
        } else {
          window.history.replaceState(null, "", "/");
        }
      },
      {
        threshold: 0.6,
      }
    );

    observer.observe(aboutSection);

    return () => observer.disconnect();
  }, []);

  const links = {
    instagram: "https://www.instagram.com/niche_0805/",
    linkedin: "https://www.linkedin.com/in/nicholas-frangos-4b857432a/",
    email: ""
  }

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
              <Button text="Resume" />
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
    </>


  )
}

