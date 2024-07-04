import './Profile.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransaction } from '../../HelperFuncs/utils';
import ProfileTopBar from './ProfileTopBar';
import { fetchProfile } from '../../HelperFuncs/utils';

function Profile() {
    const { userId } = useParams();
    const [transactions , setTransaction] = useState([]);
    const [profileData, setProfileData] = useState({
        'city': '',
        'salary': '',
        'roommates':'',
        'children':'',
        'job': ''
    })

    // call [fetchProfile] helper to retrieve the users profile info from database
    const getProfileInfo = async() => {
        try {
            const profile = await fetchProfile(userId)
            setProfileData(profile)
        }
        catch(error) {
            console.error('Error fetching profile:', error)
        }
    }

    // call [fetchTransactions] to retrieve the user's transcation data from plaid
    const getTransactions = async () => {
        try {
            const transData = await fetchTransaction(userId)
            setTransaction(transData)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }


    useEffect( () => {
        getTransactions();
        getProfileInfo();
    }, [userId]);

    return (
        <>
        <div className='TopBar'>
            <ProfileTopBar/>
        </div>
        <div className='ProfileInfo'>
            <div className='ProfileContent'>
                <h2> Profile Info </h2>
                <div className='ProfileSide'>
                    <div className='ProfilePart'>
                        <p>City: {profileData.city} </p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Salary Range: {profileData.salary}</p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Roommates: {profileData.roommates}</p>
                    </div>
                </div>
                <div className='ProfileSide'>
                    <div className='ProfilePart'>
                        <p>Children: {profileData.children}</p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Job: {profileData.jobs}</p>
                    </div>
                </div>
                <button className='EditProfileBtn'>Edit Profile</button>
            </div>
        </div>
        </>
    );
}

export default Profile;