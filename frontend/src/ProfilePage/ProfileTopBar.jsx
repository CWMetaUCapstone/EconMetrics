import './ProfileTopBar.css'
import { useNavigate, useParams } from 'react-router-dom';
import Search from '../HomePage/Top/Search';
function ProfileTopBar () {

    const navigate = useNavigate();
    const { userId } = useParams();
    // used for routing when logo is clicked
    const menloPark = encodeURIComponent('Menlo Park, CA');

    return (
        <div className='Bar'>
            <div className='Logo'>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" fill="#47894b" className="bi bi-bar-chart-line-fill" viewBox="0 0 16 16" onClick={() => navigate(`/home/${userId}`)}>
                    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
                </svg>
            </div>
            <p className='TopName' onClick={() => navigate(`/search/${menloPark}`)}>EconMetrics</p>
            <Search/>
            <button className='ProfileBtn' onClick={() => navigate(`/profile/${userId}`)}>Your Profile</button>
            <button className='LogOutBtn' onClick={() => navigate(`/search/${menloPark}` , {replace: true})}>Log Out</button>
        </div>
    )
}

export default ProfileTopBar;