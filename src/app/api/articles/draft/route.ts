import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  const db = await getDB();

  const drafts = await db
    .prepare(`
      SELECT id, title, updated_at
      FROM articles
      WHERE is_draft = 1
      ORDER BY updated_at DESC
    `)
    .all();

  return Response.json(drafts.results);
}