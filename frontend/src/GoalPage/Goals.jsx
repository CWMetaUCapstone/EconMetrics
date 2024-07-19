import './Goals.css'
import ProfileTopBar from '../ProfilePage/ProfileTopBar';

function Goals() {
    return (
        <>
        <div className='TopBar'>
            <ProfileTopBar/>
        </div>
        <div className='GoalPageContent'>
            <div className='ActiveGoals'></div>
                <div className='ActiveGoalsContent'>
                        <h2> Your Goals</h2>
                        <div className='GoalsList'>
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

                    </div>
                </div>
            </div>
        </div>

        
        </>
    )
}

export default Goals;