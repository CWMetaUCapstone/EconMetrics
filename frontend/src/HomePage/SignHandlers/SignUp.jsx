import Topbar from '../Top/Topbar';
import { submitProfile } from '../../../HelperFuncs/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './SignUp.css'

function SignUp() {

    const navigate = useNavigate(); 
    const [emailError, setEmailError] = useState('');

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
            if (response) {
                const data = await response.json();
                const id = data.userId;
                navigate(`/createprofile/${id}`, { replace: true });
            } else {
                throw new Error('no response from server for account creation');
            }
        } catch (error) {
            console.error('Sign up failed', error);
            if (error.message === 'Email already has an account') {
                setEmailError(error.message);
            } else {
                alert('Failed to sign up');
            }
        }
    };


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
                        <div className='errorMessage'>{emailError}</div>
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