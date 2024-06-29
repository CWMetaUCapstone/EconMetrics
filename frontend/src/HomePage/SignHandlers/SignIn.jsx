import './SignIn.css'
import Topbar from '../Top/Topbar'
import { logIn } from '../../../HelperFuncs/utils';
import { useNavigate } from 'react-router-dom';

function SignIn () {

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userData = {
            email: form.elements.email.value,
            password: form.elements.password.value
        };
        try {
            const response = await logIn(userData);
            const data  = await response
            const id = data.userId
            navigate(`/profile/${id}`);
        } catch(error) {
            console.error('sign in fail', error)
            alert('Failed to Sign In') 
        }

    }

    return (
        <>  
            <div className='topbar'>
                <Topbar/>
            </div>
            <div className='signinview'>
                <div className='signincontent'>
                    <h2>Sign In</h2>
                    <form onSubmit={handleSignIn}>
                        <label>Email</label>
                        <input type="text" placeholder='Email Address' name='email' required/>
                        <label>Password</label>
                        <input type="password" placeholder='Password' name='password' required/>
                        <button type='submit' className='signupformbtn'>Sign In</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignIn;