import './PageOne.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { populateAccount } from '../../../HelperFuncs/utils';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
        salary : '',
        job: ''
    })

    const { userId } = useParams();

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
        try {
            await populateAccount(formData, userId)
            nextPage()
        }
        catch(error) {
            console.error('account put fail', error)
            alert('Failed to Add Account')

        }
   }


   // helper to update the formData state object when user applies a change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
        ...prevData,
        [name]: value
        }));
    };

    /* 
    react-select returns the selected option directly 
    rather than an event like other inputs, therefore it has a unique state handler
    */
    const handleSelectChange = (selectedOption) => {
        setFormData(prevData => ({
          ...prevData,
          salary: selectedOption ? selectedOption.value : ''
        }));
      };

    return (
        <>
        <form onSubmit={handleAccount}>
                <div className='form-page'> 
                    <div className='part-one'>
                        <label>Number of Roommates</label>
                        <input type='number' name="roommates" placeholder='Roommates' onChange={handleInputChange} required></input>
                        <label>Address</label>
                        <input type='text' name="city" placeholder='Address'  onChange={handleInputChange} required></input> {/* in the near future this will be helped by google places for dynamic suggestions for address autocomplete */}
                    </div>
                    <div className='part-two'>
                        <label>Number of Children/Dependents</label>
                        <input type='number' name="children" placeholder='Children and Dependents' onChange={handleInputChange} required></input>
                        <label>Job Title</label>
                        <input type="text" name="job" placeholder='Job Title' onChange={handleInputChange} required></input>
                        <Select
                            placeholder="Salary Range"
                            closeMenuOnSelect={true}
                            components={animated}
                            options={salary_ranges}
                            className='salary-selector'
                            isClearable={true}
                            name='salary'
                            onChange={handleSelectChange}
                        />
                    </div>
            </div>
            <button type='submit' className="continuebtn">Continue</button>
        </form>
        </>
        
    )
}


export default PageOne;





