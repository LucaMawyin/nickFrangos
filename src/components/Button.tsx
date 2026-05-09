"use client";

export default function Button(props : {
    text : string; 
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "secondary";
    children?:React.ReactNode;
    className?:string;
    onClick?: ()=>void; 
}){

    function clickEvent() {
        if (props.onClick) {
            props.onClick();
        } else {
            alert(`${props.text} Not Available Yet`);
        }
    }

    const base = "w-fit py-4 px-8 rounded-lg transition duration-(--transition-time) cursor-pointer";

    const styles = {
        primary:
        "bg-(--primary-blue) text-white hover:bg-(--primary-blue-hover) hover:shadow-xl",
        secondary:
        "bg-gray-200 text-black hover:bg-gray-300 hover:shadow-md",
    };

    return(
        <button 
            type={props.type ?? "button"}
            onClick={clickEvent} 
            className={`${base} ${styles[props.variant ?? "primary"]} ${props.className ?? ""}`}>
                
            {props.text}
            {props.children}
        </button>
    )
}