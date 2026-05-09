import NavLink from '@/components/NavLink'

function NavBar(props : {pageList : string[]}){
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
                        key={page}
                        title={capitalize(page)}
                        link={page === 'about' ? '/#about' : `/${page}`}
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

export default NavBar;