import { Article as ArticleType } from "@/lib/types";
import ArticleFeed from "./ArticleFeed";
import { getArticles } from "@/lib/getArticles";

export const dynamic = "force-dynamic";

export default async function Article() {
  const articles: ArticleType[] = await getArticles();

  return <ArticleFeed articles={articles} />;
}