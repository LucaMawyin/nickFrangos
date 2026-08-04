import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { cookies } from "next/headers";
import { uploadToR2 } from "@/lib/r2";

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
    const sessionToken = cookieStore.get("session")?.value;

    const db = await getDB();

    const session = await db.prepare(`
        SELECT *
        FROM sessions
        WHERE token = ?
        AND expires_at > DATETIME('now')
    `)
    .bind(sessionToken)
    .first();

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    try {

        const formData = await req.formData();

        // Collecting form data
        const mode = formData.get("mode");
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const image = formData.get("image") as File | null;
        const id = formData.get("id") as string | null;

        const imageType =
        (formData.get("imageType") as string) ||
        (image ? image.type : null);

        // If the id exists then we update the article
        if (id) {
            await db
                .prepare(`
                UPDATE articles
                SET title = ?,
                    content = ?,
                    image_type = CASE WHEN ? IS NOT NULL THEN ? ELSE image_type END,
                    is_draft = ?,
                    is_published = ?,
                    published_at = CASE 
                        WHEN is_published = 0 AND ? = 1 THEN CURRENT_TIMESTAMP
                        ELSE published_at
                    END,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                AND author_id = ?
                `)
                .bind(
                    title,
                    content,

                    imageType,
                    imageType,

                    mode === "draft" ? 1 : 0,
                    mode === "publish" ? 1 : 0,

                    mode === "publish" ? 1 : 0,

                    id,
                    session.user_id

                )
                .run();

            if (image){
                await uploadToR2(image,"articles",id);
            }
        

            return NextResponse.json({ 
                success: true, 
                id,
            });
        }    

        // If there is no id we need to create the article
        const slug = slugify(title);

        const existingSlug = await db
            .prepare(`
                SELECT 1 FROM articles WHERE slug = ?
            `)
            .bind(slug)
            .run();

        if (existingSlug.results.length){
            return NextResponse.json(
                { error: "An article with this title already exists" },
                { status: 409 }
            );
        }

        const result = await db
            .prepare(`
                INSERT INTO articles
                (
                    title, 
                    content, 
                    image_type, 
                    slug, 
                    author_id,
                    is_draft, 
                    is_published
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `)
            .bind(
                title,
                content,
                imageType?.trim() || null,
                slug,
                session.user_id,
                mode === "draft" ? 1 : 0,
                mode === "publish" ? 1 : 0
            )
            .run();

        const newId = result.meta?.last_row_id;

        if (image){
            await uploadToR2(image,"articles",`${newId}`);
        }

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