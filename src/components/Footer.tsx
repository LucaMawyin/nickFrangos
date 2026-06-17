"use client";


import { links } from "@/lib/links";
import { usePathname } from "next/navigation";

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/settings")) {
    return null;
  }
  return (
    <footer className="w-full py-4 flex flex-col items-center gap-3 text-sm text-gray-500">
      
      <p>© {new Date().getFullYear()} Nicholas Frangos</p>

      <div className="flex gap-4">
        {Object.entries(links).map(([name, href]) => (
          <a
            key={href}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="hover:text-gray-800 transition"
          >
            {capitalize(name)}
          </a>
        ))}
      </div>

    </footer>
  );
}