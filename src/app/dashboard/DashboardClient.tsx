import Tile from "@/components/Tile";

export default function DashboardClient(){
    return (
        <div className="
        min-h-[50vh]
        flex justify-center items-center"
        >
            <Tile 
                title="Dashboard"
                disableHover={true}
                className="lg:max-w-[40vw] max-w-full"
            >
            </Tile>
        </div>
    );
}