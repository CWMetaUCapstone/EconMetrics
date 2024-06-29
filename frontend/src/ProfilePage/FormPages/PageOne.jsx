import './PageOne.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { populateAccount } from '../../../HelperFuncs/utils';
import { useState } from 'react';

function PageOne( {nextPage} ) {

    const animated = makeAnimated();

    /* 
    because the form is divided into two divs, accessing the form values is more
    nuanced requiring the use of this state object to track values
    */
    const [formData, setFormData] = useState({
        city : '' , 
        roommates : 0,
        children : 0, 
        salary : ''
    })

    /* 
    salary ranges are based on 2022 single-filer us tax brackets
    source: https://www.fidelity.com/learning-center/personal-finance/tax-brackets
    */
    const salary_ranges = [
        {value: '≤ $10,275', label: '≤ $10,275'},
        {value: '$10,275 - $41,775', label: '$10,275 - $41,775'},
        {value: '$41,776 - $89,075' , label: '41,776 - $89,075'}, 
        {value: '$89,076 - $170,050', label: '$89,076 - $170,050' },
        {value: '$170,051 - $215,950', label: '$170,051 - $215,950'},
        {value: '$215,951 - $539,900', label: '$215,951 - $539,900'},
        {value: '≥ $539,901', label: '≥ $539,901'}
    ]


    /* 
    function to handle form submission, processes form data into a dict [userData] and sends
    said list to [handleAccount] helper to interact with server-side
    */
   const handleAccount = async (e) => {
        e.preventDefault();
        const form = e.target; 
        // retrieve userId from storage
        const userId = sessionStorage.getItem('userId'); 
        const userData = {
            roommates: form.element.roommates.value,
            city: form.element.address.value, // this is a placeholder, once places api is up this will pull the city out of address
            children: form.element.children.value,
            salary: form.element.salary.value
        };
        try {
            await populateAccount(userData, userId)
            nextPage()
        }
        catch(error) {
            console.error('account put fail', error)
            alert('Failed to Add Account')

        }
   }

    return (
        <>
        <form onSubmit={handleAccount}>
                <div className='form-page'> 
                    <div className='part-one'>
                        <label>Number of Roommates</label>
                        <input type='number' name="roommates" placeholder='Roommates' required></input>
                        <label>Address</label>
                        <input type='text' name="address" placeholder='Address' required></input> {/* in the near future this will be helped by google places for dynamic suggestions for address autocomplete */}
                    </div>
                    <div className='part-two'>
                        <label>Number of Children/Dependents</label>
                        <input type='number' name="children" placeholder='Children and Dependents' required></input>
                        <Select
                            placeholder="Salary Range"
                            closeMenuOnSelect={true}
                            components={animated}
                            options={salary_ranges}
                            className='salary-selector'
                            isClearable={true}
                            name='salary'
                        />
                    </div>
            </div>
            <button type='submit' className="continuebtn">Continue</button>
        </form>
        </>
        
    )
}


export default PageOne;





