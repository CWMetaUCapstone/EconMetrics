import Topbar from '../Top/Topbar';
import { submitProfile } from '../../../HelperFuncs/utils';
import { useNavigate } from 'react-router-dom';
import './SignUp.css'

function SignUp() {

    const navigate = useNavigate(); 

    /* 
    function to handle the immedate submision of profile creation form
    extracts from the inputs and updates the state to track data
    accordingly and passes this info onto the client-side endpoint helper [submitProfile]
    */
    const handleSignUp = async (e) => {
        e.preventDefault();
        const form = e.target;
        const userData = {
            email: form.elements.email.value,
            password: form.elements.password.value
        };
        try {
            const response = await submitProfile(userData);
            const data = await response.json();
            if(response.ok) {
                // locally store user id upon creation so it can be referenced later
                sessionStorage.setItem('userId', data.userId) 
                navigate('/createprofile');
            }
        } catch(error) {
            console.error('sign up fail', error)
            alert('Failed to Sign Up') // this will be replaced with more robust handling (e.g. being explicit about using an already registerd email)
        }

    }



    return (
        <>  
            <div className='topbar'>
                <Topbar/>
            </div>
            <div className='signupview'>
                <div className='signupcontent'>
                    <h2>Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <label>Email</label>
                        <input type="text" placeholder='Email Address' name='email' required/>
                        <label>Password</label>
                        <input type="password" placeholder='Password' name='password' required/>
                        <button type='submit' className='signupformbtn'>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp;