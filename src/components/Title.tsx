
export default function Title(props: { 
    text: string; 
    colour?: string; 
    className?:string;
}) {
    return (
        <h1 className={`w-fit text-[10vw] md:text-[5em] font-semibold ${props.colour || "text-black"} ${props.className}`}>{props.text}</h1>
    )
}