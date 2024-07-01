import './PageOne.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { populateAccount } from '../../../HelperFuncs/utils';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PageOne({ nextPage }) {
    const animatedComponents = makeAnimated();
    const { userId } = useParams();

    /* 
    because the form is divided into two divs, accessing the form values is more
    nuanced requiring the use of this state object to track values
    */
    const [formData, setFormData] = useState({
        city: '',
        roommates: 0,
        children: 0,
        salary: '',
        job: ''
    });

    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        if (searchTerm) {
            const where = encodeURIComponent(JSON.stringify({
                "title": {
                    "$regex": searchTerm,
                    "$options": "i"
                }
            }));
            const headers = {
                'X-Parse-Application-Id': import.meta.env.VITE_API_BLS_ID,
                'X-Parse-REST-API-Key': import.meta.env.VITE_API_BLS_KEY
            };
            fetch(`https://parseapi.back4app.com/classes/Occupations_Job?limit=10&keys=title&where=${where}`, {
                headers: headers
            })
                .then(response => response.json())
                .then(data => {
                    if (data.results) {
                        const jobOptions = data.results.map(job => ({ value: job.title, label: job.title }));
                        setJobs(jobOptions);
                    } else {
                        console.log('No results found');
                    }
                })
                .catch(error => console.error('Error fetching jobs:', error));
        }
    }, [searchTerm]);

    /* 
    salary ranges are based on 2022 single-filer US tax brackets
    source: https://www.fidelity.com/learning-center/personal-finance/tax-brackets
    */
    const salary_ranges = [
        { value: '≤ $10,275', label: '≤ $10,275' },
        { value: '$10,275 - $41,775', label: '$10,275 - $41,775' },
        { value: '$41,776 - $89,075', label: '41,776 - $89,075' },
        { value: '$89,076 - $170,050', label: '$89,076 - $170,050' },
        { value: '$170,051 - $215,950', label: '$170,051 - $215,950' },
        { value: '$215,951 - $539,900', label: '$215,951 - $539,900' },
        { value: '≥ $539,901', label: '≥ $539,901' }
    ];

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
    const handleSelectChange = (selectedOption, action) => {
        setFormData(prevData => ({
            ...prevData,
            [action.name]: selectedOption ? selectedOption.value : ''
        }));
    };

    return (
        <>
            <form onSubmit={handleAccount}>
                <div className='form-page'>
                    <div className='part-one'>
                        <label>Number of Roommates</label>
                        <input type='number' name="roommates" placeholder='Roommates' min="0" onChange={handleInputChange} required></input>
                        <label>Address</label>
                        <input type='text' name="city" placeholder='Address' onChange={handleInputChange} required></input>
                    </div>
                    <div className='part-two'>
                        <label>Number of Children/Dependents</label>
                        <input type='number' name="children" placeholder='Children and Dependents' min="0"  onChange={handleInputChange} required></input>
                        <Select
                            placeholder="Type to search job titles..."
                            closeMenuOnSelect={true}
                            components={animatedComponents}
                            options={jobs}
                            onInputChange={setSearchTerm}
                            onChange={(option) => handleSelectChange(option, { name: 'job' })}
                            isClearable={true}
                            name='job'
                            className='selector'
                        />
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