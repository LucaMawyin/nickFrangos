import { Article } from "@/lib/types";
import { getDB } from "@/lib/db";
import { deleteArticle } from "./actions";
import { validateSession } from "@/lib/auth";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";

export default async function ArticlePage({ params }: any){

    const session = await validateSession();

    const db = await getDB();
    const article = await db
        .prepare("SELECT * FROM articles WHERE slug = ? AND is_published = 1")
        .bind(params.slug)
        .first<Article>();

    if (!article) {
        return <h1 className="p-10">Article not found</h1>;
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
                Published{" "}
                {new Date(article.published_at + "Z").toLocaleDateString(
                    "en-US",
                    { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )}
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Updated{" "}
                {new Date(article.updated_at + "Z").toLocaleDateString(
                    "en-US",
                    { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                )}  
            </p>

            <div className="mt-6 whitespace-pre-wrap">
                {article.content}
            </div>

            <div className="flex justify-center mt-10">
                {session && (
                    <div className="flex 
                        flex-col 
                        gap-12
                        sm:flex-row justify-between"
                    >
                        <EditButton slug={article.slug} className="w-full sm:w-48"/>

                        <DeleteButton 
                            className="w-full sm:w-48"
                            action={async () => {
                                "use server";
                                await deleteArticle(article.id);
                            }}
                        />                    
                    </div>

                )}
            </div>

        </div>
    );
}