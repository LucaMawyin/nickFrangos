"use client";
import Link from 'next/link'
import { usePathname } from "next/navigation";

function NavLink(props: { title: string; link: string }){

    const pathName = usePathname();

    const handleClick = (e: React.MouseEvent) => {
        if (props.link === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        if (props.link.startsWith("#")) {
            e.preventDefault();

            const sectionId = props.link.replace("#", "");

            document.getElementById(sectionId)?.scrollIntoView({
                behavior: "smooth",
            });
        }
    };



    return (
        <Link 
            href={props.link} 
            onClick={handleClick} 
            className="relative text-xl
            after:content-[''] after:absolute after:left-0 after:-bottom-1
            after:h-0.5 after:w-full after:bg-current
            after:scale-x-0 after:origin-left
            after:transition-transform after:duration-(--transition-time)
            hover:after:scale-x-100"
        >
            {props.title}
        </Link>
    );
}

export default NavLink;