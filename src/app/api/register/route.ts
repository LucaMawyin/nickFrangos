import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDB } from "@/lib/db";
import { LoginBody } from "@/lib/types";

export async function POST(req: Request) {
  const { email, password } = await req.json() as LoginBody;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const db = await getDB();

  const hashed = await bcrypt.hash(password, 10);

  await db
    .prepare("INSERT INTO users (email, password) VALUES (?, ?)")
    .bind(email, hashed)
    .run();

  return NextResponse.json({ success: true });
}