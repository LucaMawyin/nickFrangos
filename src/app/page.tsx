import { getContent } from "@/lib/getContent";
import HomeClient from "./HomeClient";

export default async function Page() {
    const content = await getContent();
    return <HomeClient content={content} />;
}