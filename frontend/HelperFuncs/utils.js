// this file contains a suite of generic helper functions for use across the program


/*
helper function to handle client-side user sign up submission
by making a post request to append new row in profile table for email and password onto 
*/
export const submitProfile = async (userData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return response;
    } 
    catch(error) {
        console.error('Error adding profile: ', error)
    }
}


/* 
helper function to make put request to update user data with profile info 
from account creation form
*/
export const populateAccount = async (userData, userId) => { 
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profiles/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }
    catch(error) {
        console.log("error updating profile", error)
    }
}


/* 
helper function that makes a POST request to the [/login] endpoint which handles user
verification
*/
export const logIn = async (userData) => {
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            console.error('Login Failed:', data.error);
        }
    } catch (error) {
        console.error('error:', error);
    }
}


/*
helper function to fetch list of jobs matching [searchTerm] from the 
back4app BLS occupations list endpoint
*/
export const fetchJobTitles = async (searchTerm) => {
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
    return fetch(`https://parseapi.back4app.com/classes/Occupations_Job?limit=10&keys=title&where=${where}`, {
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                // map the fetched options into the value-label form react-select uses
                const jobOptions = data.results.map(job => ({ value: job.title, label: job.title }));
                return(jobOptions)
            } else {
                console.log('No results found');
            }
        })
        .catch(error => console.error('Error fetching jobs:', error));
}
