import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { User } from "@/lib/types";
import { LoginBody } from "@/lib/types";

export async function POST(request : Request){
    try {

        const { email, password } = await request.json() as LoginBody;

        if (!email || !password) {
            return NextResponse.json(
                { error: "Missing Credentials" },
                { status: 400 }
            );
        }

        const db = await getDB();

        const user = ( await db
            .prepare("SELECT * FROM users WHERE email = ?")
            .bind(email)
            .first()
        ) as User | null;

        if (!user){
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
 
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 401 }
            );
        }

        const sessionToken = crypto.randomUUID();
        const userIP =
            request.headers.get('CF-Connecting-IP') ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        const userAgent = request.headers.get("User-Agent") || "unknown";

        await db.prepare(`
            INSERT INTO sessions (token, user_id, expires_at, ip_address, user_agent)
            VALUES (?, ?, datetime('now', '+1 days'), ?, ?)
        `).bind(sessionToken, user.id, userIP, userAgent).run();

        const res = NextResponse.json({ success: true });

        res.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return res;
    }

    catch (err) {
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}