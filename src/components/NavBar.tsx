
import NavBarClient from "./NavBarClient";
import { Page } from "@/lib/types";
import { validateSession } from "@/lib/auth";

type Props = {
    pageList: Page[];
};

export default async function NavBar( props : Props ) {

    const session = await validateSession();

    return (
        <NavBarClient
            pageList={props.pageList}
            isLoggedIn={!!session}
        />
    );
}