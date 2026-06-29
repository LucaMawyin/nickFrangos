"use client";

import { useRef, useState, useEffect } from "react";
import type { Article, ArticleResponse } from "@/lib/types"
import Link from "next/link";
import Tile from "@/components/Tile";

export default function ArticleFeed(props : {articles : Article[]}){

    const [articles, setArticles] = useState(props.articles);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    async function loadMore(){

        if (loading || !hasMore) return;

        setLoading(true);

        try {

            const response = await fetch(
                `/api/articles?limit=8&offset=${articles.length}`
            );

            const data = await response.json() as ArticleResponse;

            if (data.articles.length === 0){

                setHasMore(false);

            } else {

                setArticles((prev) => [
                    ...prev,
                    ...data.articles
                ]);
            }

        } catch (error){

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {

                if (entries[0].isIntersecting){
                    loadMore();
                }
            },
            { threshold: 0 }
        );

        if (loaderRef.current){

            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();

    }, [articles, loading, hasMore]);

    return (
        <>
            <div className="
                p-[5%]
                w-full
                grid
                gap-8
                grid-cols-[repeat(auto-fit,minmax(300px,1fr))]
                xl:grid-cols-4
                place-items-stretch
                auto-rows-fr

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
                                {article.image && (
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full mt-4"
                                    />
                                )}
                                <div className="p-4 pl-0 pb-0">
                                    <p>Published{" "}
                                        {new Date(article.published_at).toLocaleDateString(
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

            {hasMore && (

                <div
                    ref={loaderRef}
                    className="h-20 flex items-center justify-center"
                >
                    {loading && <p>Loading...</p>}
                </div>
            )}
        </>
    );
}