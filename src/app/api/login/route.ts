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

        const res = NextResponse.json({ success: true });

        res.cookies.set("session", String(user.id), {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
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