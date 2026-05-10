import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateClient from "./CreateClient";

export default async function CreatePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    redirect("/login");
  }

  return <CreateClient />;
}