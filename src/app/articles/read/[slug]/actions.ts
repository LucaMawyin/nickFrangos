"use server";

import { validateSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteArticle(id: number) {
    const session = await validateSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    const db = await getDB();

    const result = await db
        .prepare(`
            DELETE FROM articles
            WHERE id = ?
            AND author_id = ?
        `)
        .bind(
            id,
            session.user_id
        )
        .run();

    if (result.meta.changes === 0) {
        throw new Error("Article not found or unauthorized");
    }

    redirect("/articles");
}