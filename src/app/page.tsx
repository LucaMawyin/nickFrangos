import { getContent } from "@/lib/getContent";
import HomeClient from "./HomeClient";
import { SocialLink } from "@/lib/types";
import { getLinks } from "@/lib/getLinks";

export default async function Page() {

    const [content, links ] = await Promise.all([
        getContent(),
        getLinks(),
    ]);


    return (
        <HomeClient 
            content={content} 
            links={links as SocialLink[]}
        />
    );
}