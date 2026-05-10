import { cookies } from "next/headers";

import NavBarClient from "./NavBarClient";
import { Page } from "@/lib/types";

type Props = {
    pageList: Page[];
};

export default async function NavBar( props : Props ) {

    const cookieStore = await cookies();

    const session =
        cookieStore.get("session")?.value ?? null;

    return (
        <NavBarClient
            pageList={props.pageList}
            session={session}
        />
    );
}