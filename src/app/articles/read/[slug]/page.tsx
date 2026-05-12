import { Article } from "@/lib/types";
import { getDB } from "@/lib/db";
import { deleteArticle } from "./actions";
import Button from "@/components/Button";
import { validateSession } from "@/lib/auth";
import DeleteButton from "@/components/DeleteButton";

export default async function ArticlePage({ params }: any){

    const session = await validateSession();

    const db = await getDB();
    const article = await db
        .prepare("SELECT * FROM articles WHERE slug = ?")
        .bind(params.slug)
        .first<Article>();

    if (!article) {
        return <h1>Article not found</h1>;
    }

    return (
        <div className="p-10 max-w-3xl mx-auto">
            {article.image_type && (
                <img
                    src={`/api/articles/image/${article.id}`}
                    alt={article.title}
                    className="w-full h-auto rounded-lg mb-6 object-cover"
                />
            )}

            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-sm text-gray-500 mt-2">
                {new Date(article.created_at).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                )}
            </p>

            <div className="mt-6 whitespace-pre-wrap">
                {article.content}
            </div>

            <div className="flex justify-center mt-10">
                {session && (
                    <DeleteButton 
                        action={async () => {
                            "use server";
                            await deleteArticle(article.id);
                        }}
                    />
                )}
            </div>

        </div>
    );
}