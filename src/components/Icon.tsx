
function Icon(prop : {path : string, link : string}){

    const iconPath = `/icons/${prop.path}.svg`;

    return (
        <a 
            href={prop.link} 
            onClick={()=>(
                prop.link === "" ? alert(`${prop.path} Not Implemented Yet`) : null
            )}
            target={prop.link === "" ? '' : '_blank'} 
            rel="noopener noreferrer"
        >

            <img 
                src={iconPath} 
                alt={prop.path} 
                className="h-15 w-auto self-start transform transition-transform duration-(--transition-time) hover:scale-110"
            />
        </a>
    );
}

export default Icon