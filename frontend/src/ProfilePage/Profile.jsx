import './Profile.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransactions } from '../../HelperFuncs/plaidHelp';
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
    const [spendingByCategory, setSpendingByCategory] = useState({
        'rent': 0.0,
        'utilities': 0.0,
        'housing': 0.0,
        'loans': 0.0,
        'student_loans':0.0,
        'car_loans_and_lease':0.0,
        'credit_card_payments':0.0,
        'other_loans':0.0,
        'entertainment':0.0,
        'streaming_services':0.0,
        'other_entertainment':0.0,
        'food':0.0,
        'resturants':0.0,
        'groceries':0.0,
        'medical_care':0.0,
        'transportation':0.0,
        'gas':0.0,
        'parking':0.0,
        'ride_share':0.0,
        'public_transit':0.0
    });

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
            const transData = await fetchTransactions(userId);
            setTransaction(transData)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }


    useEffect( () => {
        getTransactions();
        getProfileInfo();
    }, []);

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