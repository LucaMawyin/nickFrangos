"use client";

import { useEffect, useState } from "react";
import Tile from '@/components/Tile';

type Article = {
    id: number;
    title: string;
    content: string;
    created_at: string;
};


export default function Article(){
    
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);


    useEffect(() => {
        
        const fetchData = async () => {
            try { 
                const response = await fetch('/api/articles', {
                    cache: "no-store",
                });
                
                const data: { articles?: Article[] } = await response.json();


                if (data.articles){
                    setArticles(data.articles);
                    setSuccess(true);
                }

                else{
                    setSuccess(false);
                    setArticles([]);
                }

            }catch(error){
                setSuccess(false);
            }finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

            {loading && <p>Loading...</p>}

            {!loading && articles.length === 0 && (
                <h1>Failed to load articles</h1>
            )}

            {success && articles.map( article => (
                <Tile 
                    key={article.id} 
                    title={article.title} 
                    className="max-w-full min-w-0 h-full w-full"
                    titleClassName="text-[clamp(1.25rem,2.5vw,2.25rem)]"
                >
                    <div>
                        <p>
                            {new Date(article.created_at).toLocaleDateString(
                                "en-US", 
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </p>
                    </div>
                </Tile>
            ))}
            
        </div>
    );
}