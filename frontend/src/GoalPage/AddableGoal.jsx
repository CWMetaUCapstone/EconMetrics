import './AddableGoal.css'
import { goalFormatter } from '../../HelperFuncs/utils';
import { useParams } from 'react-router-dom';

function AddableGoal({goal, setActiveGoals}) {

    const { userId } = useParams();

    const message = goalFormatter(goal.category, goal.target);

    const addGoal = async() => {
        const response = await fetch(`http://localhost:3000/followgoal/${userId}/${goal.id}`,
        { method: 'POST' }
        );
        if (!response.ok) {
            throw new Error('Network response was not ok at addGoal', Error);
        }
        else {
            setActiveGoals(prev => [... prev, goal])
        }
    }

    return (
        <div className='Goal' key={goal.id}>
            <button className='AddButton' onClick={addGoal}>Add Goal</button>
            <h3 className='GoalName'>{message}</h3>
        </div>
    )
}

export default AddableGoal;