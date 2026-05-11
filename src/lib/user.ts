import { getDB } from "@/lib/db";

export async function getUser(email: string) {
    const db = await getDB();

    const user = await db
        .prepare("SELECT * FROM users WHERE email = ?")
        .bind(email)
        .first();

    return user ?? null;
}