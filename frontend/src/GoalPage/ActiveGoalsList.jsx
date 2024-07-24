import './ActiveGoalsList.css'
import ActiveGoal from './ActiveGoal';

function ActiveGoalsList({goals}) {
    return (
        <div className='ActiveGoalList'> 
            {goals.map(goal => (
                <ActiveGoal
                    goal = {goal}
                />
            ))}
        </div>
    )
}

export default ActiveGoalsList;