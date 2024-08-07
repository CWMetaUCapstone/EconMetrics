import './CreateAccount.css'
import Topbar from '../HomePage/Top/Topbar';
import PageOne from './FormPages/PageOne';
import PageTwo from './FormPages/PageTwo';
import { useState } from 'react';


function CreateAccount() {

    // use this state object to track the current page of form
    const [page, setPage] = useState(1);

    // helpers to move page forward and backward
    const nextPage = () => {
        setPage(page + 1)
    }

    const backPage = () => {
        setPage (page - 1)
    }

    return (
        <>
            <div className='topbar'>
                <Topbar/>
            </div>
            <div className='createaccountview'>
                <div className='createaccountcontent'>
                    <h2>Create Account</h2>
                    <div className='pages'>
                        {page == 1 ? <PageOne nextPage={nextPage}/> : <PageTwo backPage={backPage}/>}
                    </div>
                </div>
            </div>
        </>
    )
}


export default CreateAccount;