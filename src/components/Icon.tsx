
export default function Icon(props : {path : string, link : string}){

    const iconPath = `/icons/${props.path}.svg`;

    return (
        <a 
            href={props.link} 
            onClick={()=>(
                props.link === "" ? alert(`${props.path} Not Implemented Yet`) : null
            )}
            target={props.link === "" ? "" : "_blank"} 
            rel="noopener noreferrer"
        >

            <img 
                src={iconPath} 
                alt={props.path} 
                className="h-15 w-auto self-start transform transition-transform duration-(--transition-time) hover:scale-110"
            />
        </a>
    );
}