import './ActiveGoalsList.css'
import ActiveGoal from './ActiveGoal';

function ActiveGoalsList({goals, setActiveGoals}) {
    return (
        <div className='ActiveGoalList'> 
            {goals.map(goal => (
                <ActiveGoal
                    goal = {goal}
                    setActiveGoals={setActiveGoals}
                />
            ))}
        </div>
    )
}

export default ActiveGoalsList;