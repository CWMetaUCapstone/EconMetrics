import Topbar from '../Top/Topbar';
import './SignUp.css'

function SignUp() {
    return (
        <>  
            <div className='topbar'>
                <Topbar/>
            </div>
            <div className='signupview'>
                <div className='signupcontent'>
                    <h2>Sign Up</h2>
                    <form>
                        <label>Email</label>
                        <input type="text" placeholder='Email Address' required/>
                        <label>Password</label>
                        <input type="password" placeholder='Password' required/>
                        <button type='submit' className='signupformbtn' onClick={submitProfile}>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp;