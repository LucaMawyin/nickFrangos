import { Article } from "@/lib/types";
import { getDB } from "@/lib/db";
import { deleteArticle } from "./actions";
import { validateSession } from "@/lib/auth";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import Link from "next/link";
import LocalDateTime from "@/components/LocalDateTime";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

    const session = await validateSession();

    const { slug } = await params;

    const db = await getDB();
    const article = await db
        .prepare("SELECT * FROM articles WHERE slug = ? AND is_published = 1")
        .bind(slug)
        .first<Article>();

    if (!article) {
        return <h1 className="p-10">Article not found</h1>;
    }
    
    return (
        <div className="p-8 max-w-3xl mx-auto">
            
            <Link
                href="/articles"
                className="inline-block mb-8 hover:scale-110 transition-transform duration-(--transition-time)"
            >
                &lt; Back to Articles
            </Link>

            {article.image_type && (
                <img
                    src={`/api/articles/image/${article.id}?v=${article.updated_at}`}
                    alt={article.title}
                    className="w-full h-auto rounded-lg mb-6 object-cover"
                />
            )}

            <h1 className="text-3xl font-bold">{article.title}</h1>
            <p className="text-sm text-gray-500 mt-4">
                Published <LocalDateTime value={article.published_at} />
            </p>
            <p className="text-sm text-gray-500 mt-2">
                Updated <LocalDateTime value={article.updated_at} />

            </p>

            <div className="mt-6 whitespace-pre-wrap">
                {article.content}
            </div>

            <div className="flex justify-center mt-10">
                {session && (
                    <div className="flex 
                        flex-col 
                        sm:gap-12
                        gap-8
                        sm:flex-row justify-between
                        w-full    
                    ">
                        <EditButton id={article.id} className="w-full sm:w-48"/>

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