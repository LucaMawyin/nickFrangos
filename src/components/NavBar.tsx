import NavLink from "@/components/NavLink"

type Page = {
    title:string;
    href:string;
}

export default function NavBar(props : {pageList : Page[]}){
    return (
        <header className="
        bg-white
        flex flex-row 
        items-center 
        justify-between 
        px-[5vw] py-[2vw] 
        shadow-sm/10 
        h-[10vh]
        sticky top-0 z-50">
            <NavLink title="Nicholas" link="/" />
            <nav className="flex gap-6">
                {props.pageList.map((page) => (
                    <NavLink 
                        key={page.href}
                        title={capitalize(page.title)}
                        link={page.href === "about" ? "/#about" : `/${page.href}`}
                    />
                ))}
            </nav>
        </header>
    );
}

// Capitalize every word of a string
// Input: String to capitalize
// Output: String with every word capitalized 
function capitalize(str : string) : string{
    return str
            .toLowerCase()
            .split(" ")
            .map(word=> word.charAt(0).toUpperCase()+word.slice(1))
            .join(" ");
}