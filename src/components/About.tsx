import ReactMarkdown from "react-markdown";
import Title from './Title';

export default function About(props : {about : string}){
    
    return (
        <div className="flex flex-col justify-evenly min-h-[80vh] p-[5%]">

            <div className="flex flex-wrap gap-8">

                {/* IMAGE */}
                <div className="w-[30%] min-w-75 mx-auto md:mx-0">
                    <Title text="About Me" className="pb-8 mx-auto text-[10em]"/>
                    <img 
                        src="/images/commentating.jpg" 
                        alt="Headshot"
                        className="w-full sm:max-w-[70%] h-auto mx-auto object-cover rounded-xl"
                    />                           
                </div>
                {/* TEXT*/}
                <div className="m-auto w-[40%] min-w-75">
                    <div className="whitespace-pre-line text-xl font-normal text-center sm:text-start">
                        <ReactMarkdown>{props.about}</ReactMarkdown>
                    </div>
                </div>
            </div>



        </div>
    );
}
