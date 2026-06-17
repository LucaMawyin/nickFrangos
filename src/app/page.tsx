import getContent from "@/lib/getContent";
import HomeClient from "./HomeClient";

export default async function Page() {
  const about = await getContent();

  return <HomeClient about={about} />;
}