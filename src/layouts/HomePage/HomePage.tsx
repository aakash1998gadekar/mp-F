import Carousal from "./Components/Carousal";
import { ExploteTopBooks } from "./Components/ExploreTopBooks";
import { Heros } from "./Components/Heros";
import { LibraryService } from "./Components/LibraryService";

export const HomePage = () => {
    return(
        <>
        <ExploteTopBooks/>
        <Carousal/>
        <Heros />
        <LibraryService />
        </>
    );
}