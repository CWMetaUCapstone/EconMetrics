import './ActiveGoal.css'
import { useParams } from 'react-router-dom';
import { goalFormatter } from '../../HelperFuncs/utils';

function ActiveGoal( {goal, setActiveGoals} ) {

    const { userId } = useParams();

    const message = goalFormatter(goal.category, goal.target);

    const removeGoal = async() => {
        try { 
            const response = await fetch(`http://localhost:3000/removegoal/${userId}/${goal.id}`,
            { method: 'PUT' }
           );
           if (!response.ok) {
               throw new Error('Network response was not ok at removeaGoal', Error);
           } 
            else {
                setActiveGoals(prev => prev.filter(activeGoals => activeGoals !== goal))
           }
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