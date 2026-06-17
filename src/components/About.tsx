import Tile from '@/components/Tile'

export default function About(props : {about : string}){
    
    return (
        <div className="box-border
            flex flex-row flex-wrap 
            justify-evenly 
            gap-y-[5vh] py-[5vh] min-h-[90vh]">

            <Tile 
                title="About Me"
                disableHover={true}
            >
                <img 
                    src="/images/headshot.jpg" 
                    alt="Headshot"
                    className="max-w-[75%] p-[5%] self-center"/>
                <div className="flex flex-col flex-1 p-[5%] justify-end">
                    <p>{props.about}</p>
                </div>
            </Tile>

            <Tile 
                title="Education"
                disableHover={true}
            >
                <img 
                    src="/images/tmu.png"
                    alt="School Logo"
                    className="max-w-[75%] p-[5%] self-center"
                />
                <div className="flex flex-col flex-1 p-[5%] justify-end">
                    <p><b>School:</b> Toronto Metropolitan University</p>
                    <p><b>Major:</b> Sports Media</p>
                    <p><b>Level:</b> 3rd year</p>
                </div>
            </Tile>
        </div>
    );
}