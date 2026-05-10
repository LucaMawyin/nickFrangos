import { pages } from "@/lib/pages";

export const protectedRoutes = pages
  .filter(p => p.requireLogin)
  .map(p => "/" + p.href);