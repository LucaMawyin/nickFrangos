import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { User } from "@/lib/types";
import { LoginBody } from "@/lib/types";
import { Resend } from "resend";


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

        console.log({
            cf: request.headers.get("cf-connecting-ip"),
            xff: request.headers.get("x-forwarded-for"),
            ua: request.headers.get("user-agent"),
        });

        const userAgent = request.headers.get("User-Agent") || "unknown";

        // Getting user geo info
        const geo = await getGeoFromIp(userIP);

        // Adding to DB
        await db.prepare(`
            INSERT INTO sessions (token, user_id, expires_at, ip_address, geo, user_agent)
            VALUES (?, ?, datetime('now', '+1 days'), ?, ?, ?)
        `).bind(sessionToken, user.id, userIP, JSON.stringify(geo), userAgent).run();

        const res = NextResponse.json({ success: true });

        res.cookies.set("session", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        try {
            await sendLoginEmail(email, userIP, geo, userAgent);
        } catch (e) {
            console.error("Email failed", e);
        }

        return res;
    }

    catch (err) {
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}

async function getGeoFromIp(ip: string) {
    const token = process.env.IPIFY_TOKEN;

    if (!token || ip === "unknown") return null;

    try {
        const res = await fetch(`https://geo.ipify.org/api/v2/country,city,vpn?apiKey=${token}&ipAddress=${ip}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return err;
    }
}

async function sendLoginEmail(
    email: string,
    ip: string,
    geo: any,
    userAgent: string
) {

    const token = process.env.RESEND_TOKEN

    const resend = new Resend(token);

    await resend.emails.send({
        from: "NicholasFrangos.com <onboarding@resend.dev>",
        to: email,
        subject: "New login detected",
        html: `
            <h2>New Login Alert</h2>
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Device:</strong> ${userAgent}</p>
            <p><strong>Country:</strong> ${geo?.location?.country || "Unknown"}</p>
            <p><strong>Region:</strong> ${geo?.location?.region || "Unknown"}</p>
            <p>If this wasn't you, please reset your password immediately.</p>
        `,
    });
}