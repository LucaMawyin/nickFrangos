import { getDB } from "@/lib/db";
import CreateClient from "../CreateClient";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: any) {
  const id = searchParams?.id ? Number(searchParams.id) : null;
  const slug = searchParams?.slug || null;

  let draft = null;
  let article = null;

  const db = await getDB();

  if (id) {
  
    draft = await db
      .prepare(`
        SELECT * FROM articles
        WHERE id = ? AND is_draft = 1
      `)
      .bind(id)
      .first();
  }

  if (!article && slug) {
    article = await db
      .prepare(`
        SELECT * FROM articles
        WHERE slug = ?
      `)
      .bind(slug)
      .first();
  }

  if (!draft && !article) {
    redirect("/articles/create-article");
  }

  const data = draft || article;

  let imageUrl = null;

  if (data?.image) {
    const base64 = Buffer.from(data.image as any).toString("base64");
    imageUrl = `data:${data.image_type};base64,${base64}`;
  }

  return (
    <CreateClient
      title={draft ? "Edit Draft" : "Edit Article"}
      initialData={{ ...data, imageUrl }}
    />
  );
}