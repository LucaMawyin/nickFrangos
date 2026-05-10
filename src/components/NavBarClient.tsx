"use client";

import NavLink from "@/components/NavLink"
import { Page } from "@/lib/types";
import { useState } from "react";

export default function NavBarClient(
    props : {
        pageList : Page[];
        session : string | null;
}){

    const [ open, setOpen ] = useState(false);

    return (
        <>
            <header className="
                bg-white
                hidden
                md:flex flex-row 
                items-center 
                justify-between 
                px-[5vw] py-[2vw] 
                shadow-sm/10 
                h-[10vh]
                sticky top-0 z-50"
            >
                <NavLink title="Nicholas" link="/" />
                <nav className="flex gap-6">
                    {props.pageList.map((page) => (
                        (!page.requireLogin || props.session) && 
                        !(page.href === "login" && props.session) && 
                        (
                            <NavLink 
                                key={page.href}
                                title={capitalize(page.title)}
                                link={`/${page.href}`}
                            />
                        )
                    ))}
                </nav>
            </header>

            <header className="
                bg-white
                md:hidden
                flex 
                items-center 
                justify-between 
                px-[5vw] py-[2vw] 
                shadow-sm/10 
                h-[10vh]
                sticky top-0 z-50"
            >  
                <NavLink
                    title="Nicholas"
                    link="/"
                />     
                <button 
                    className="
                        flex flex-col gap-1
                        hover:cursor-pointer
                    " 
                    onClick={() => {setOpen(!open)}}
                >
                    <span className="w-6 h-0.5 bg-black"></span>
                    <span className="w-6 h-0.5 bg-black"></span>
                    <span className="w-6 h-0.5 bg-black"></span>                    
                </button>
            </header>

            <div
                className={`
                    md:hidden
                    fixed inset-0
                    bg-white
                    z-50
                    flex flex-col
                    items-center
                    justify-center
                    gap-8

                    transition-transform
                    duration-(--transition-time)
                    ease-in-out             
                    
                    ${open ? "translate-y-0" : "-translate-y-full"}
                `}
            
            >
                <button
                    className="
                        text-3xl
                        hover:cursor-pointer
                    "
                    onClick={() => setOpen(false)}
                >
                    x
                </button>
               

                


                {props.pageList.map((page) => (
                    (!page.requireLogin || props.session) && 
                    !(page.href === "login" && props.session) && 
                    (
                        <div
                            key={page.href}
                            onClick={() => {setOpen(false)}}
                        >
                            <NavLink 
                                title={capitalize(page.title)}
                                link={`/${page.href}`}
                            />
                        </div>
                    )
                ))}
            </div>                
        </>


    );
}

// Capitalize every word of a string
// Input: String to capitalize
// Output: String with every word capitalized 
function capitalize(str : string) : string{
    return str
            .toLowerCase()
            .split(" ")
            .map(word=> word.charAt(0).toUpperCase()+word.slice(1))
            .join(" ");
}