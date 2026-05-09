import Image from 'next/image'
import headshot from '@/app/assets/images/headshot.jpg'
import Tile from '@/components/Tile'

function About(){
    
    return (
        <div className='box-border
            flex flex-row flex-wrap 
            justify-evenly 
            gap-y-[5vh] py-[5vh] min-h-[90vh]'>

            <Tile title="About Me">
                <Image 
                    src={headshot} 
                    alt="Headshot"
                    className='max-w-[75%] p-[5%] self-center'/>
                <p>Name: Nicholas</p>
                <p>Interests:</p>
                <p>Favourite Quote:</p>
            </Tile>

            <Tile title="Education">
                <p><b>School:</b> Toronto Metropolitan University</p>
                <p><b>Major:</b> Sports Media</p>
                <p><b>Level:</b> 3rd year</p>
            </Tile>
        </div>
    );
}

export default About;