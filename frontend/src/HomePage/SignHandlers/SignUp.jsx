import Topbar from '../Top/Topbar';
import { submitProfile, isValidPassword } from '../../../HelperFuncs/utils';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './SignUp.css'

function SignUp() {

    const navigate = useNavigate(); 
    const [emailError, setEmailError] = useState('');
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false);

    const visibleEyePath = (
        <>
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
        </>
    )

    const hiddenEyePath = (
        <>
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
        </>
    )


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
        const passwordData = isValidPassword(password)
        if(passwordData[0]){
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
        }
        else(setPasswordError(passwordData[1]))
    };

    // this effect is to remove the error message of a duplicate email once the email input field is cleared
    useEffect(() => {
        if(email === ''){
            setEmailError('')
        }
    }, [email])

    useEffect(() => {
        // clear message if password is cleared, otherwise, check the password's validity dynamically to give realtime feedback
        if (password === '') {
            setPasswordError(''); 
        } else {
            const passwordData = isValidPassword(password);
            if (!passwordData[0]) {
                setPasswordError(passwordData[1]); 
            } else {
                setPasswordError('');
            }
        }
    }, [password]); 


    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
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
                        <input type="text" placeholder='Email Address' name='email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        <div className='errorMessage'>{emailError}</div>
                        <label>Password</label>
                        <div className='passwordContainer'>
                            <input type={passwordVisible ? "text" : "password"} placeholder='Password' name='password' className='passwordInput' onChange={(e) => setPassword(e.target.value)} required/>
                            <svg onClick={togglePasswordVisibility} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="eye" viewBox="0 0 16 16">
                                {passwordVisible ? visibleEyePath : hiddenEyePath}
                            </svg>
                        </div>
                        <div className='errorMessage'>{passwordError}</div>
                        <button type='submit' className='signupformbtn'>Sign Up</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUp;