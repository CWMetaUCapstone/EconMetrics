import './Goals.css'
import ProfileTopBar from '../ProfilePage/ProfileTopBar';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchActiveGoals } from '../../HelperFuncs/utils';
import AddGoalsList from './AddGoalsList';
import ActiveGoalsList from './ActiveGoalsList';
import AddGoals from './AddGoalsList';

function Goals() {

    const { userId } = useParams();
    const [activeGoals, setActiveGoals] = useState([]);

    const getActiveGoals = async () => {
        try {
            const fetchedGoals = fetchActiveGoals(userId)
            setActiveGoals(fetchedGoals)
        } catch (error) {
            console.error('Error fetching active goals:', error);
        }
    }

    useEffect(() => {
        getActiveGoals();
    }, [userId])



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
                    <AddGoals/>
                </div>
            </div>
            <div className='AddGoals'>
                <div className='AddGoalsContent'>
                    <h2>Add a New Goal</h2>
                    <div className='AddList'>
                        <AddGoals/>
                    </div>
                </div>
            </div>
        </div>

        
        </>
    )
}

export default Goals;