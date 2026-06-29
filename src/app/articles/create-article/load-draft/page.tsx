import { getDB } from "@/lib/db";
import CreateClient from "../CreateClient";
import { redirect } from "next/navigation";
import { getImageDataUrl } from "@/lib/r2";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const sp = await searchParams;

  const id = sp?.id ? Number(sp.id) : null;

  let draft = null;

  const db = await getDB();

  if (id) {
    draft = await db
      .prepare(`
        SELECT * FROM articles
        WHERE id = ?
      `)
      .bind(id)
      .first();
  }

  if (!draft) {
    redirect("/articles/create-article");
  }

  const data = draft;

  let imageUrl = null;

  if (data?.image_type) {
    imageUrl = await getImageDataUrl(String(id));
  }

  return (
    <CreateClient
      title={draft ? "Edit Draft" : "Edit Article"}
      initialData={{ ...data, imageUrl }}
    />
  );
}