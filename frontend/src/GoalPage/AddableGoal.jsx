import './AddableGoal.css'
import { goalFormatter, followNewGoal} from '../../HelperFuncs/utils';
import { useParams } from 'react-router-dom';

function AddableGoal({goal, setActiveGoals}) {

    const { userId } = useParams();

    const message = goalFormatter(goal.category, goal.target);

    const addGoal = async() => {
        try { 
            const _ = followNewGoal(goal.id, userId)
            setActiveGoals(prev => [... prev, goal])
        } catch (error) {
            console.error('Error adding goal:', error);
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