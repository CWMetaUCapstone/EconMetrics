import './PageOne.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { populateAccount, salary_ranges } from '../../../HelperFuncs/utils';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobTitles } from '../../../HelperFuncs/utils';
import { AddressAutofill } from '@mapbox/search-js-react';

function PageOne({ nextPage }) {
    const animatedComponents = makeAnimated();
    const { userId } = useParams();

    /* 
    because the form is divided into two divs, accessing the form values is more
    nuanced requiring the use of this state object to track values
    */
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        postal: '',
        roommates: 0,
        children: 0,
        salary: '',
        job: ''
    });

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const getSearchedJobs = async () => {
        const jobNames = await fetchJobTitles(searchTerm)
        setJobs(jobNames)
    }

    useEffect(() => {
        if (searchTerm != '') {
            getSearchedJobs()
        }
    }, [searchTerm]);

    /* 
    function to handle form submission, processes form data into a dict [userData] and sends
    said list to [handleAccount] helper to interact with server-side
    */
    const handleAccount = async (e) => {
        e.preventDefault();
        try {
            await populateAccount(formData, userId);
            nextPage();
        } catch (error) {
            console.error('account put fail', error);
            alert('Failed to Add Account');
        }
    };

    // generic helper to update the formData state object when user applies a change
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
    const handleSelectChange = (selectedOption, action) => {
        setFormData(prevData => ({
            ...prevData,
            [action.name]: selectedOption ? selectedOption.value : ''
        }));
    };


    const handleAddressSelect = (selectedAddress) => {
        const { city, state, postal } = selectedAddress;
        setFormData(prevData => ({
            ...prevData,
            city: city,
            state: state,
            postal: postal
        }));
    }

    return (
        <>
            <form onSubmit={handleAccount}>
                <div className='form-page'>
                    <div className='part-one'>
                        <label>Number of Roommates</label>
                        <input type='number' name="roommates" placeholder='Roommates' min="0" onChange={handleInputChange} required></input>
                        <label>Address</label>
                        <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_KEY} onSelect={handleAddressSelect}> 
                            <input type="text" placeholder='Address' autoComplete="street-address"required/>
                            <label>City</label>
                            <input type="text" name="city" autoComplete='address-level2' onChange={handleInputChange} readOnly />
                            <label>State</label>
                            <input type="text" name="state" autoComplete='address-level1' onChange={handleInputChange} readOnly />
                            <label>Postal Code</label>
                            <input type="text" name="postal" autoComplete='postal-code' onChange={handleInputChange} readOnly />
                        </AddressAutofill>
                    </div>
                    <div className='part-two'>
                        <label>Number of Children/Dependents</label>
                        <input type='number' name="children" placeholder='Children and Dependents' min="0"  onChange={handleInputChange} required></input>
                        <label>Job Title</label>
                        <Select
                            placeholder="Job Title"
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={jobs}
                            onInputChange={setSearchTerm}
                            onChange={(option) => handleSelectChange(option, { name: 'job' })}
                            isClearable={true}
                            name='job'
                            className='selector'
                        />
                        <label>Salary Range</label>
                        <Select
                            placeholder="Salary Range"
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={salary_ranges}
                            className='selector'
                            isClearable={true}
                            name='salary'
                            onChange={(option) => handleSelectChange(option, { name: 'salary' })}
                        />
                    </div>
                </div>
                <button type='submit' className="continuebtn">Continue</button>
            </form>
        </>
    );
}
export default PageOne;