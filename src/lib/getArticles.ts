import { getDB } from "@/lib/db";
import { Article } from "@/lib/types";
import { getImageDataUrl } from "./r2";

export const getArticles = async (): Promise<Article[]> => {
    const db = await getDB();

    const { results } = (await db
    .prepare(`
        SELECT *
        FROM articles
        WHERE is_published = TRUE
        ORDER BY updated_at DESC
    `)
    .all()) as { results: Article[] };

    const articles = await Promise.all(
        results.map(async (a) => {
            const image = await getImageDataUrl(String(a.id));

            return {
            ...a,
            image,
            };
        })
    );

    return articles;
};