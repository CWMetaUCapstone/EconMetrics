import './Goals.css'
import ProfileTopBar from '../ProfilePage/ProfileTopBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchActiveGoals, fetchAvailableGoals } from '../../HelperFuncs/utils';
import AddGoalsList from './AddGoalsList';
import ActiveGoalsList from './ActiveGoalsList';

function Goals() {

    const { userId } = useParams();
    const [activeGoals, setActiveGoals] = useState([]);
    const [availableGoals, setAvailableGoals] = useState([]);

    const getActiveGoals = async () => {
        try {
            const fetchedGoals = await fetchActiveGoals(userId)
            setActiveGoals(fetchedGoals)
        } catch (error) {
            console.error('Error fetching active goals:', error);
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
        }  catch (error) {
            console.error('Error fetching available goals:', error);
        }
        
    }

    useEffect(() => {
        getActiveGoals();
    }, [])

    useEffect(() => {
        console.log('wow')
        getGoalsToAdd();
    }, [activeGoals])

    // this call forces page to rerender when goal containers are clicked to update when goals are added/removed dynamically
    const clickHandler = () => {
        getActiveGoals();
        getGoalsToAdd();
    }


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
                            <ActiveGoalsList goals={activeGoals}/>
                        </div>
                </div>
            <div className='SuggestedGoals'>
                <div className='SuggestedGoalsContent'>
                    <h2> Personalized Suggested Goals</h2>
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