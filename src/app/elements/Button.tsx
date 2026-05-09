"use client";

function Button(prop : {text : string}){

    function clickEvent(){
        alert(`${prop.text} Not Available Yet`);
    }

    return(
        <button 
            onClick={clickEvent} 
            className="
            hover:cursor-pointer hover:shadow-xl hover:bg-(--primary-blue-hover) 
            bg-(--primary-blue) text-white 
            w-fit py-4 px-8 rounded-lg 
            transition duration-(--transition-time)">
                
            {prop.text}
        </button>
    )
}

export default Button;