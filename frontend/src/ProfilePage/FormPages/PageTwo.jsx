import PlaidLink from "./PlaidLink";
import { useParams } from "react-router-dom";
import './PageTwo.css'

function PageTwo ( {backPage}) {

    const { userId } = useParams();

    return (
        <>
        <PlaidLink userId={userId}/>
        
        <button className="back-btn" onClick={backPage}>Previous</button>
        </>
    )
}

export default PageTwo;