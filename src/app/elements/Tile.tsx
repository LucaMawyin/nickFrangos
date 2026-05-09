
function Tile(props : {title : string, children?: React.ReactNode, className?: string, titleClassName?: string}){
    return (
        <div 
            className={`
            flex
            flex-1
            flex-col
            
            ${props.className?.includes("max-w")? "" : "max-w-[40vw]"} 
            ${props.className?.includes("min-w")? "" : "min-w-75"}
            rounded-xl 
            shadow-[0_15px_30px_rgba(0,0,0,0.25)] 
            p-[2%]
            
            transition-all duration-(--transition-time) ease-out
            hover:shadow-2xl
            hover:-translate-y-2
            ${props.className??''}`}>
            <h1 
                className={`
                    ${props.titleClassName?.includes("text-") ? "" : "text-[3em]" } 
                    ${props.titleClassName}`
                }
            >
                {props.title}
            </h1>

            <div className='flex flex-col flex-1 p-[5%] justify-end'>
                {props.children}
            </div>
            
        </div>
    );
}

export default Tile;