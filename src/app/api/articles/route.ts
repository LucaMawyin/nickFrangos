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
            published_at,
            image_type
        FROM articles
        WHERE is_draft=0
        AND is_published=1
        ORDER BY published_at DESC
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

    const mode = formData.get("mode");
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;
    const id = formData.get("id") as string | null;

    const imageType =
      (formData.get("imageType") as string) ||
      (image ? image.type : null);

    let imageBuffer: Buffer | null = null;

    if (image){
      const arrayBuffer = await image.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    }

    const db = await getDB();

    console.log("imageBuffer exists:", !!imageBuffer);
    console.log("imageType:", imageType);

    if (id) {
      const result = await db
        .prepare(`
          UPDATE articles
          SET title = ?,
              content = ?,
              image = CASE WHEN ? IS NOT NULL THEN ? ELSE image END,
              image_type = CASE WHEN ? IS NOT NULL THEN ? ELSE image_type END,
              is_draft = ?,
              is_published = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `)
        .bind(
          title,
          content,

          imageBuffer,
          imageBuffer,

          imageType,
          imageType,

          mode === "draft" ? 1 : 0,
          mode === "publish" ? 1 : 0,

          id
        )
        .run();

        console.log("rows affected:", result.meta?.changes);
        

      return NextResponse.json({ success: true, id });
    }    

    
    const slug = slugify(title);

    const result = await db
      .prepare(`
        INSERT INTO articles
        (title, content, image, image_type, slug, is_draft, is_published)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        title,
        content,
        imageBuffer,
        imageType?.trim() || null,
        slug,
        mode === "draft" ? 1 : 0,
        mode === "publish" ? 1 : 0
      )
      .run();

    const newId = result.meta?.last_row_id;

    return NextResponse.json({
      success: true,
      id: newId,
      slug
    });
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