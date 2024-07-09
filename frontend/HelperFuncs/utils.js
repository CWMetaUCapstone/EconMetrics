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
        error('Error adding profile: ', error)
    }
}


/* 
helper function to make put request to update user data with profile info 
from account creation form
*/
export const populateAccount = async (userData, userId) => { 
    try {
        const _ = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profiles/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }
    catch(error) {
        console.error("error updating profile", error)
        // if we didn't fetch anything return empty
        return {}
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
                console.error('No results found for jobOptions');
            }
        })
        .catch(error => console.error('Error fetching jobs:', error));
}


/*
helper function to fetch profile data for user at [userId] from the database
*/
export const fetchProfile = async (userId) => {
    const response = await fetch(`http://localhost:3000/profiles/${userId}`, 
    { method: 'GET' })
    if(!response.ok) {
        throw new Error('Network response was not ok at fetchProfile', Error);
    }
    const data = await response.json();
    return data;
}


/*
helper function to get the lastest posted row from the Transactions table
*/
export const fetchTransaction = async (userId) => {
    const response = await fetch(`http://localhost:3000/transactions/${userId}`,
    { method: 'GET' })
    if(!response.ok) {
        throw new Error('Network response was not ok at fetchTransaction', Error);
    }
    const data = await response.json();
    return data;
}

/*
helper function to format the transactions map object into an array of rows
that can be passed into the handler [getDataPath] to form the category groups
*/
export const getRows = (transactions) => {
    const rows = [];
    for (const category in transactions) {
        if (transactions[category]) {
            const { total_percent, details } = transactions[category];
            const roundedTotalPercent = parseFloat(total_percent.toFixed(2));
            rows.push({
                category: [category],
                your_percent: `${roundedTotalPercent}%`,
                your_percent_value: roundedTotalPercent,
                average: 'N/A',
                difference: 'N/A' 
            });
            for(let i=0; i < details.length; i++){
                // this guard catches the catch-all categories travel and medical from appearing twice
                if(details[i].name != category) {
                    rows.push({
                        category: [category, details[i].name],
                        your_percent: `${parseFloat(details[i].percent.toFixed(2))}%`,
                        your_percent_value: parseFloat(details[i].percent.toFixed(2)),
                        average: 'N/A',
                        difference: 'N/A'
                    })
                }
            }
        }
    }
    return rows;
};