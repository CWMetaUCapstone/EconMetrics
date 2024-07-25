import './Goals.css'
import ProfileTopBar from '../ProfilePage/ProfileTopBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchActiveGoals, fetchAvailableGoals, fetchTransaction, fetchSimilarUsers, fetchProfile } from '../../HelperFuncs/utils';
import { findPersonalizedGoals } from '../../HelperFuncs/personalization';
import AddGoalsList from './AddGoalsList';
import ActiveGoalsList from './ActiveGoalsList';

function Goals() {

    const { userId } = useParams();
    const [activeGoals, setActiveGoals] = useState([]);
    const [personalizedGoals, setPersonalizedGoals] = useState([]);
    const [availableGoals, setAvailableGoals] = useState([]);
    const [transaction, setTransaction] = useState([]);
    const [similarUsers, setSimilarUsers] = useState([])

    const getActiveGoals = async () => {
        try {
            const fetchedGoals = await fetchActiveGoals(userId)
            setActiveGoals(fetchedGoals)
        } catch (error) {
            console.error('Error fetching active goals:', error);
        }
    }

    const getUserTransaction = async () => {
        try{
            const transactionData = await fetchTransaction(userId)
            setTransaction(transactionData);
        } catch (error) {
            console.error('Error fetching user transaction:', error);
        }
    }

    /*
    helper that first retrieves the profile data for the logged in user and exchanges this data
    for the set of similar users
    */
    const getSimilarUserData = async () => {
        try {
            const userData = await fetchProfile(userId);
            if (userData) {
                try {
                    const similarData = await fetchSimilarUsers(userData);
                    setSimilarUsers(similarData);
                } catch(error) {
                    console.error('Error fetching similar users:', error)
                }
            }
        } catch (error) {
            console.error('error fetching user data:', error);
        }
    }

    // fetch all goals and then filter out goals this user is already tracking
    const getGoalsToAdd = async () => {
        try {
            const fetchedGoals = await fetchAvailableGoals();
            // if a user is already tracking a goal it shouldn't be in the list of available goals
            const filteredGoals = fetchedGoals.filter(goal => 
                !activeGoals.some(activeGoal => activeGoal.id === goal.id)
            );
            setAvailableGoals(filteredGoals);
            const personalGoals = findPersonalizedGoals(filteredGoals, transaction, similarUsers)
            setPersonalizedGoals(personalGoals)
        }  catch (error) {
            console.error('Error fetching available goals:', error);
        }
        
    }

    useEffect(() => {
        getActiveGoals();
        getUserTransaction();
        getSimilarUserData();
    }, [])

    useEffect(() => {
        getGoalsToAdd();
    }, [activeGoals])


    return (
        <>
        <div className='TopBar'>
            <ProfileTopBar/>
        </div>
        <div className='GoalPageContent'>
            <div className='ActiveGoals'></div>
                <div className='ActiveGoalsContent'>
                        <h2> Your Active Goals</h2>
                        <div className='GoalsList'>
                            <ActiveGoalsList goals={activeGoals}  setActiveGoals={setActiveGoals}/>
                        </div>
                </div>
            <div className='SuggestedGoals'>
                <div className='SuggestedGoalsContent'>
                    <h2> Personalized Suggested Goals</h2>
                        <AddGoalsList goals={personalizedGoals} setActiveGoals={setActiveGoals}/>
                </div>
                <div className='SuggestedList'>
                </div>
            </div>
            <div className='AddGoals'>
                <div className='AddGoalsContent'>
                    <h2>Add a New Goal</h2>
                    <div className='AddList'>
                        <AddGoalsList goals={availableGoals} setActiveGoals={setActiveGoals}/>
                    </div>
                </div>
            </div>
        </div>

        
        </>
    )
}

export default Goals;