import './Topbar.css'
import Search from './Search'

function Topbar() {
    return (
        <div className='bar'>
            <div className='logo'>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="50" fill="#47894b" className="bi bi-bar-chart-line-fill" viewBox="0 0 16 16">
                    <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z"/>
                </svg>
            </div>
            <p className='topname'>EconMetrics</p>
            <Search/>

            <button className='signinbtn'>Sign In</button>
            <button className='signupbtn'>Sign Up</button>

        </div>
    )
}

export default Topbar;