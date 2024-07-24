import './ActiveGoal.css'
import { useParams } from 'react-router-dom';
import { goalFormatter, stopTrackingGoal} from '../../HelperFuncs/utils';

function ActiveGoal( {goal} ) {

    const { userId } = useParams();

    const message = goalFormatter(goal.category, goal.target);

    const removeGoal = async() => {
        try { 
            const _ = stopTrackingGoal(goal.id, userId)
        } catch (error) {
            console.error('Error removing goal:', error);
        }
    }

    return(
        <div className='Goal' key={goal.id}>
            <h3 className='GoalName'>{message}</h3>
            <button className='RemoveButton' onClick={removeGoal}>Remove Goal</button>
        </div>
    )
}

export default ActiveGoal;