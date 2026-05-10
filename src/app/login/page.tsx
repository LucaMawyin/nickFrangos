import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    let isLoggedIn = false;

    if (token) {
        const db = await getDB();

        const session = await db.prepare(`
            SELECT * FROM sessions WHERE token = ?
        `).bind(token).first();

        isLoggedIn = !!session;
    }

    return <LoginClient isLoggedIn={isLoggedIn} />;
}