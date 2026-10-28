import { getActiveSessions, requireSession } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import SettingsClient from "./SettingsClient";
import { getContent } from "@/lib/getContent";
import { getLinks } from "@/lib/getLinks";
import { SocialLink } from "@/lib/types";

export default async function DashboardPage() {
    const session = await requireSession();

    const [user, content, sessions, links] = await Promise.all([
        getUserById(session.user_id),
        getContent(),
        getActiveSessions(),
        getLinks(),
    ]);
    
    const { currentSession, activeSessions } = sessions;

    if (user){
        return (
            <SettingsClient 
                user={user} 
                content={content} 
                activeSessions={activeSessions} 
                currentSession={currentSession}
                links={links as SocialLink[]}
            />
        );
    }

    return <p>User not found</p>
}