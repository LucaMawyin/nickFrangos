import { getDB } from "@/lib/db";

export async function GET(request: Request, context: any) {
    const { params } = context;
    const db = await getDB();

    const row = await db
        .prepare("SELECT image, image_type FROM articles WHERE id = ?")
        .bind(params.id)
        .first<{ image: ArrayBuffer; image_type: string }>();

    if (!row?.image) {
        return new Response("Not found", { status: 404 });
    }

    const bytes = new Uint8Array(row.image);

    return new Response(bytes, {
        headers: {
            "Content-Type": row.image_type,
            "Cache-Control": "public, max-age=86400",
        },
    });
}