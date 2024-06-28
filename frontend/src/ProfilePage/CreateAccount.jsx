import './CreateAccount.css'
import Topbar from '../HomePage/Top/Topbar';


function CreateAccount() {
    return (
        <>
            <div className='topbar'>
                <Topbar/>
            </div>
            <div className='createaccountview'>
                <div className='createaccountcontent'>
                    <h2>Create Account</h2>
                </div>
            </div>
        </>
    )
}


export default CreateAccount;