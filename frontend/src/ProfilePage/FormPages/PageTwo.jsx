import PlaidLink from "../PlaidLink";
import { useParams } from "react-router-dom";


function PageTwo ( {backPage}) {

    const { userId } = useParams();

    return (
        <>
        <PlaidLink userId={userId}/>
        
        <button onClick={backPage}>Previous</button>
        </>
    )
}

export default PageTwo;