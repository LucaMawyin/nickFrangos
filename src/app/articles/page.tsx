import { headers } from "next/headers";
import Tile from "@/components/Tile";
import Link from "next/link";
import { Article as ArticleType } from "@/lib/types";

export default async function Article(){
    
    const h = await headers();
    const host = h.get("host");

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(
        `${protocol}://${host}/api/articles`,
        { cache: "no-store" }
    );

    const data: {articles? : ArticleType[]} = await response.json();

    const articles = data.articles ?? [];

    return (
        <div className="
            p-[5%]
            w-full
            grid
            gap-8
            grid-cols-[repeat(auto-fit,minmax(300px,1fr))]
            xl:grid-cols-4
            place-items-stretch
        ">

            {articles.length === 0 ? (
                <h1>Failed to load articles</h1>
            ) : (
                articles.map((article) => (
                    <Link key={article.id} href={`/articles/read/${article.slug}`}>
                        <Tile 
                            key = {article.id}
                            title={article.title}
                            className="max-w-full min-w-0 h-full w-full p-[5%]"
                            titleClassName="text-[clamp(2rem,2.5vw,2.25rem)]"
                        >
                            {article.image_type && (
                                <img
                                    src={`/api/articles/image/${article.id}`}
                                    alt={article.title}
                                    className="w-full mt-4"
                                />
                            )}
                            <div className="p-4">
                                <p>
                                    {new Date(article.created_at).toLocaleDateString(
                                        "en-US", 
                                        {year : "numeric", month:"long", day:"numeric"}
                                    )}
                                </p>
                            </div>

                        </Tile>
                    </Link>

                ))
            )}
            
        </div>
    );
}