import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import CreateClient from "./CreateClient";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    let isLoggedIn = false;

    if (!token){
      redirect("/login");
    }

    const db = await getDB();

    const session = await db.prepare(`
        SELECT * FROM sessions WHERE token = ?
    `).bind(token).first();
    
    if (!session){
      redirect("/login");
    }

    return <CreateClient />;
}