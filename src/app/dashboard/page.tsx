import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function Dashboard(){
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session){
        redirect("/login");
    }

    return <DashboardClient/>
}