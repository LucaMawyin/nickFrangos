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
                { 
                    status : "error",
                    error : "Invalid Credentials"
                },{ status: 401 }
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

        const verificationCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

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
            verificationCode,
            userIP,
            JSON.stringify(geo),
            userAgent
        )
        .run();

        await sendVerificationEmail(
            email,
            verificationCode,
            userIP,
            geo,
            userAgent
        );

        return NextResponse.json({
            status: "verification_required"
        });
    }

    catch (err) {

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
    const token = process.env.IPINFO_KEY;

    if (!token || ip === "unknown") return null;

    try {
        const res = await fetch(
            `https://ipinfo.io/${ip}?token=${token}`
        );
    if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return err;
    }
}

async function sendVerificationEmail(
    email: string,
    code: string,
    ip: string,
    geo: any,
    userAgent: string
) {
    const resend = new Resend(process.env.RESEND_TOKEN);
    
    await resend.emails.send({
        from: "Nicholas Frangos <security@nicholasfrangos.com>",
        to: email,
        subject: "Your Login Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #111;">
                
                <h2 style="margin-bottom: 10px;">
                    Verify Your Login
                </h2>

                <p>
                    A login attempt was made on your account.
                </p>

                <div
                    style="
                        margin: 30px 0;
                        padding: 20px;
                        text-align: center;
                        background: #f4f4f4;
                        border-radius: 10px;
                    "
                >
                    <p style="margin: 0; font-size: 14px; color: #666;">
                        Your verification code
                    </p>

                    <h1
                        style="
                            margin: 10px 0 0;
                            font-size: 42px;
                            letter-spacing: 8px;
                        "
                    >
                        ${code}
                    </h1>
                </div>

                <h3 style="margin-top: 30px;">
                    Login Details
                </h3>

                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Device:</strong> ${userAgent}</p>
                <p><strong>Country:</strong> ${geo?.country || "Unknown"}</p>
                <p><strong>Region:</strong> ${geo?.region || "Unknown"}</p>
                <p><strong>City:</strong> ${geo?.city || "Unknown"}</p>

                <p style="margin-top: 30px;">
                    This code expires in 10 minutes.
                </p>

                <p style="color: #666; font-size: 14px;">
                    If this wasn't you, you can safely ignore this email.
                </p>

            </div>
        `,
    });
}