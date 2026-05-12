import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

// Fetching articles
export async function GET(request: NextRequest) {
  const db = await getDB();
  const searchParams = request.nextUrl.searchParams;
  
  // Limit to 8 articles in one query
  const limit = Number(searchParams.get("limit")) || 8;
  const offset = Number(searchParams.get("offset")) || 0;


    const { results } = await db
    .prepare(`
        SELECT
            id,
            title,
            slug,
            created_at,
            image_type
        FROM articles
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `)
    .bind(limit, offset)
    .all();

    return NextResponse.json({
        articles: results
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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;
    const imageType =
      (formData.get("imageType") as string) ||
      (image ? image.type : null);

    let imageBuffer: Buffer | null = null;

    if (image){
      const arrayBuffer = await image.arrayBuffer();
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
      .prepare("INSERT INTO articles (title, content, image, image_type, slug) VALUES (?, ?, ?, ?, ?)")
      .bind(title, content, imageBuffer, imageType?.trim() || null, slug)
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