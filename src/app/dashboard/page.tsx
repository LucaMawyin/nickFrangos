import { requireSession } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await requireSession();

    const user = await getUserById(session.user_id);

    if (user){
        return <DashboardClient user={user}/>;
    }

    return <p>User not found</p>
}