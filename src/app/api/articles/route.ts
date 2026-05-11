import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// Fetching articles
export async function GET() {
  const db = await getDB();

  const { results } = await db
    .prepare("SELECT * FROM articles")
    .all();

  const articles = results.map((a: any) => ({
    ...a,
    image: a.image
      ? Buffer.from(a.image).toString("base64")
      : null,
  }));

  return Response.json({ articles });
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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File | null;

    let imageBuffer: Buffer | null = null;

    if (file){
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

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
      .prepare("INSERT INTO articles (title, content, image, slug) VALUES (?, ?, ?, ?)")
      .bind(title, content, imageBuffer, slug)
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