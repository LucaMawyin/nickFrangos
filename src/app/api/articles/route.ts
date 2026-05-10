import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Article } from "@/lib/types";
import { cookies } from "next/headers";

// Fetching articles
export async function GET() {
  const db = await getDB();

  const { results } = await db
    .prepare("SELECT * FROM articles")
    .all();

  return Response.json({
    articles: results,
  });
}

// POST for create-article 
export async function POST(req: Request) {

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { title, content } = await req.json() as Article;

    const db = await getDB();

    // Slug is mandatory
    const slug = slugify(title);

    // no duplicate slugs
    const existing = await db
      .prepare("SELECT id FROM articles WHERE slug = ?")
      .bind(slug)
      .first();

    if (existing) {
      return NextResponse.json(
        { error: "Article Already Exists" },
        { status: 400 }
      );
    }

    await db
      .prepare("INSERT INTO articles (title, content, slug) VALUES (?, ?, ?)")
      .bind(title, content, slug)
      .run();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to Create Article" },
      { status: 500 }
    );
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}