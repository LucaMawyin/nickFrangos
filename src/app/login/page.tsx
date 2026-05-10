import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    return <LoginClient isLoggedIn={!!session}/>;
}