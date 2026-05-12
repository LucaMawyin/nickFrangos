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

    await db
        .prepare("DELETE FROM articles WHERE id = ?")
        .bind(id)
        .run();

    redirect("/articles");
}