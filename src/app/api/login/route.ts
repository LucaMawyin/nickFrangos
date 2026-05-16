import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
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

        // Check if user exists
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

        // Password validation
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 401 }
            );
        }

        // Deleting old verifications under user id
        await db.prepare(`
            DELETE FROM login_verifications
            WHERE user_id = ?
        `).bind(user.id).run();

        const verificationToken = crypto.randomUUID();

        const userIP =
            request.headers.get('CF-Connecting-IP') ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";
        
        const userAgent = request.headers.get("User-Agent") || "unknown";

        const geo = await getGeoFromIp(userIP);

        await db.prepare(`
            INSERT INTO login_verifications
            (user_id, token, expires_at, ip_address, geo, user_agent)
            VALUES (?, ?, datetime('now', '+10 minutes'), ?, ?, ?)
        `)
        .bind(
            user.id,
            verificationToken,
            userIP,
            JSON.stringify(geo),
            userAgent
        )
        .run();

        await sendVerificationEmail(
            email,
            verificationToken,
            userIP,
            geo,
            userAgent
        );

        return NextResponse.json({
            requiresVerification: true
        });
    }

    catch (err) {
        console.error("LOGIN ERROR:", err);

        return NextResponse.json(
            { 
                error: "Server Error",
                details: err instanceof Error ? err.message : String(err)
            },
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
        from: "Nicholas Frangos <security@nicholasfrangos.com>",
        to: email,
        subject: "New Login Attempt",
        html: `
            <h2>New Login Alert</h2>
            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Device:</strong> ${userAgent}</p>
            <p><strong>Country:</strong> ${geo?.location?.country || "Unknown"}</p>
            <p><strong>Region:</strong> ${geo?.location?.region || "Unknown"}</p>
            <p><strong>City:</strong> ${geo?.location?.city || "Unknown"}</p>
            <p>If this wasn't you, please reset your password immediately.</p>
        `,
    });
}

async function sendVerificationEmail(
    email: string,
    token: string,
    ip: string,
    geo: any,
    userAgent: string
) {
    const resend = new Resend(process.env.RESEND_TOKEN);

    const verifyUrl =
        `${process.env.NEXT_PUBLIC_APP_URL}/verify-login?token=${token}`;

    await resend.emails.send({
        from: "Nicholas Frangos <security@nicholasfrangos.com>",
        to: email,
        subject: "Verify Your Login",
        html: `
            <h2>Verify Login Attempt</h2>

            <p>A login attempt was made on your account.</p>

            <p><strong>IP:</strong> ${ip}</p>
            <p><strong>Device:</strong> ${userAgent}</p>
            <p><strong>Country:</strong> ${geo?.location?.country || "Unknown"}</p>
            <p><strong>Region:</strong> ${geo?.location?.region || "Unknown"}</p>
            <p><strong>City:</strong> ${geo?.location?.city || "Unknown"}</p>

            <p>
                <a href="${verifyUrl}">
                    Verify Login
                </a>
            </p>

            <p>This link expires in 10 minutes.</p>
        `,
    });
}