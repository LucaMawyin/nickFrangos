import { headers } from "next/headers";
import { Article as ArticleType } from "@/lib/types";
import ArticleFeed from "./ArticleFeed";

export default async function Article(){
    
    const h = await headers();
    const host = h.get("host");

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(
        `${protocol}://${host}/api/articles?limit=8&offset=0`,
        { cache: "no-store" }
    );

    const data: {articles? : ArticleType[]} = await response.json();

    const articles = data.articles ?? [];

    return (
        <ArticleFeed articles={articles} />
    );
}