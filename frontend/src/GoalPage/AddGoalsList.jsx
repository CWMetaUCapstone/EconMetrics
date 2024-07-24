import './AddGoalsList.css'
import AddableGoal from './AddableGoal';

function AddGoalsList( {goals, setActiveGoals} ) {
    return( 
        <div className='AddGoalsList'>
            {goals.map(goal => (
                <AddableGoal
                    goal = {goal}
                    setActiveGoals= {setActiveGoals}
                />
            ))}

        </div>
    )
}

export default AddGoalsList;

