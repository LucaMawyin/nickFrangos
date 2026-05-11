import { requireSession } from "@/lib/auth";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await requireSession();

    return <DashboardClient session={session} />;
}