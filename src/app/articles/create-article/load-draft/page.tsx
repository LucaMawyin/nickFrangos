import { getDB } from "@/lib/db";
import CreateClient from "../CreateClient";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: any) {
  const id = searchParams?.id ? Number(searchParams.id) : null;

  let draft = null;

  if (!id) {
    redirect("/articles/create-article");
  }

  if (id) {
    const db = await getDB();

    draft = await db
      .prepare(`
        SELECT * FROM articles
        WHERE id = ? AND is_draft = 1
      `)
      .bind(id)
      .first();
  }

  if (!draft){
    redirect("/articles/create-article");
  }

  let imageUrl = null;

  if (draft?.image) {
    const base64 = Buffer.from(draft.image as any).toString("base64");
    imageUrl = `data:${draft.image_type};base64,${base64}`;
  }

  return (
  <CreateClient
    title="Load Existing Article"
    initialData={
      draft
        ? { ...draft, imageUrl }
        : null
      }
    />
  );
}