import './EditProfileModal.css';
import { useState, useEffect } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { salary_ranges, fetchJobTitles, populateAccount } from '../../HelperFuncs/utils';

// the logic of editing the profile is recycled from the setup on PageOne.jsx as both make requests to the same endpoint
function EditProfileModal({view, closeView, profileData}) {

    if (!view) {
        return null;
    }

    const animatedComponents = makeAnimated(); 

    const [formData, setFormData] = useState(profileData);

    const handleAddressSelect = (selectedAddress) => {
        const { city, state, postal } = selectedAddress;
        setFormData(prevData => ({
            ...prevData,
            city: city,
            state: state,
            postal: postal
        }));
    }

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        try {
            await populateAccount(formData, profileData.id);
            closeView()
        } catch (error) {
            console.error('account put fail', error);
            alert('Failed to Update Profile');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption, action) => {
        setFormData(prevData => ({
            ...prevData,
            [action.name]: selectedOption ? selectedOption.value : ''
        }));
    };

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

    return(
        <div className='Modal'>
            <div className='ModalContent'>
                <span className="CloseButton" onClick={closeView}>&times;</span>
                <div className='TitleContainer'>
                    <h2>Edit Profile</h2>
                </div>
                <form onSubmit={handleAccountUpdate}>
                    <div className='FormColumns'>
                        <div className='AddressForm'>
                            <label>Address</label>
                            <AddressAutofill accessToken={import.meta.env.VITE_MAPBOX_KEY} onSelect={handleAddressSelect}> 
                                <input type="text" placeholder='Address' autoComplete="street-address"/>
                                <label>City</label>
                                <input type="text" name="city" placeholder={profileData.city} autoComplete='address-level2' onChange={handleInputChange} readOnly />
                                <label>State</label>
                                <input type="text" name="state" placeholder={profileData.state} autoComplete='address-level1' onChange={handleInputChange} readOnly />
                                <label>Postal Code</label>
                                <input type="text" name="postal" placeholder={profileData.postal} autoComplete='postal-code' onChange={handleInputChange} readOnly />
                            </AddressAutofill>
                        </div>
                        <div className='SecondFormColumn'>
                            <label>Number of Roommates</label>
                            <input type='number' name="roommates" min="0" onChange={handleInputChange} placeholder={profileData.roommates}></input>
                            <label>Number of Children/Dependents</label>
                            <input type='number' name="children" placeholder={profileData.children} min="0"  onChange={handleInputChange}></input>
                            <label>Salary Range</label>
                            <Select
                                placeholder={profileData.salary}
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                options={salary_ranges}
                                className='Selector'
                                isClearable={true}
                                name='salary'
                                onChange={(option) => handleSelectChange(option, { name: 'salary' })}
                            />
                             <label>Job Title</label>
                            <Select
                                placeholder={profileData.job}
                                closeMenuOnSelect={true}
                                components={animatedComponents}
                                options={jobs}
                                onInputChange={setSearchTerm}
                                onChange={(option) => handleSelectChange(option, { name: 'job' })}
                                isClearable={true}
                                name='job'
                                className='Selector'
                            />
                        </div>
                    </div>
                    <button type='submit' className="UpdateBtn">Update Profile</button>
                </form>
            </div>
        </div>
    )
}

export default EditProfileModal;