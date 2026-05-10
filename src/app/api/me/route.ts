import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";


export async function GET() {

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const db = await getDB();

  const user = await db
    .prepare("SELECT id, email FROM users WHERE id = ?")
    .bind(session)
    .first();

  if (!user) {
    return NextResponse.json(
      { error: "Invalid Session" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}