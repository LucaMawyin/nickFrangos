import { headers } from "next/headers";
import Tile from '@/components/Tile';


type Article = {
    id: number;
    title: string;
    content: string;
    created_at: string;
};


export default async function Article(){
    
    const h = await headers();
    const host = h.get("host");

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const response = await fetch(
        `${protocol}://${host}/api/articles`,
        { cache: "no-store" }
    );

    const data: {articles? : Article[]} = await response.json();

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
                    <Tile 
                        key = {article.id}
                        title={article.title}
                        className="max-w-full min-w-0 h-full w-full"
                        titleClassName="text-[clamp(1.25rem,2.5vw,2.25rem)]"
                    >
                        <p>
                            {new Date(article.created_at).toLocaleDateString(
                                "en-US", 
                                {year : "numeric", month:"long", day:"numeric"}
                            )}
                        </p>
                    </Tile>
                ))
            )}
            
        </div>
    );
}