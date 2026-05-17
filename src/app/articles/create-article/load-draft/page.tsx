import { getDB } from "@/lib/db";
import CreateClient from "../CreateClient";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: any) {
  const id = searchParams?.id ? Number(searchParams.id) : null;

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