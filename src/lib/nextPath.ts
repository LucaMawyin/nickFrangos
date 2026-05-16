import { pages } from "@/lib/pages";

export function isSafeNext(path: string) {
    if (!path) return false;

    if (!path.startsWith("/")) return false;
    if (path.startsWith("//")) return false;
    if (path.includes("://")) return false;

    const cleanPath = path.split("?")[0].split("#")[0];

    return pages.some(page => {
        const pagePath = "/" + page.href.replace(/^\/+/, "");
        return cleanPath === pagePath;
    });
}