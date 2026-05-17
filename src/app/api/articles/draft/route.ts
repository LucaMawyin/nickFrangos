import { getDB } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = await getDB();

  const session = await db
    .prepare(`SELECT * FROM sessions WHERE token = ?`)
    .bind(token)
    .first();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();

  const id = formData.get("id"); // important for updates
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const image = formData.get("image") as File | null;
  const imageType = formData.get("imageType") as string | null;

  // convert image to buffer (if exists)
  let imageBuffer = null;

  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  // UPDATE existing draft
  if (id) {
    await db.prepare(`
      UPDATE articles
      SET title = ?,
          content = ?,
          image = COALESCE(?, image),
          image_type = COALESCE(?, image_type),
          is_draft = 1,
          is_published = 0,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      content,
      imageBuffer,
      imageType,
      id
    ).run();

    return Response.json({ success: true, id });
  }

  // CREATE new draft
  const slug = title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

  const result = await db.prepare(`
    INSERT INTO articles (
      title,
      slug,
      content,
      image,
      image_type,
      is_draft,
      is_published
    )
    VALUES (?, ?, ?, ?, ?, 1, 0)
  `).bind(
    title,
    slug,
    content,
    imageBuffer,
    imageType
  ).run();

  return Response.json({
    success: true,
    id: result.meta.last_row_id
  });
}

export async function GET() {
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