"use client";


import { links } from "@/lib/links";
import { pages } from "@/lib/pages";
import { SocialLink } from "@/lib/types";
import { usePathname } from "next/navigation";

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function Footer(props : {links: SocialLink[]}) {
    const pathname = usePathname();

    const requiresLogin = pages.some((page) => {
        if (page.href.startsWith("#")) return false;

        const base = "/" + page.href;

        return (
        (pathname === base || pathname.startsWith(base + "/")) &&
        page.requireLogin
        );
    });

    if (requiresLogin) return null;

    return (
        <footer className="w-full py-4 flex flex-col items-center gap-3 text-sm text-gray-500">
        
            <p>© {new Date().getFullYear()} Nicholas Frangos</p>

            <div className="flex gap-4">
                {props.links.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link.title}
                    </a>
                ))}
            </div>

        </footer>
    );
}