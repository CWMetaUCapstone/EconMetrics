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
        if (!response.ok) {
            if (response.headers.get("content-type")?.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            } else {
                throw new Error('Server error');
            }
        }
        return response;
    } 
    catch(error) {
        console.error('Error adding profile: ', error);
        throw error
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
export const getRows = (transactions, similarUsers) => {
    const rows = [];
    for (const category in transactions) {
        if (transactions[category]) {
            const { total_percent, details } = transactions[category];
            const roundedTotalPercent = parseFloat(total_percent.toFixed(2));
            // by default, average and difference are N/A to cover case of no simlar users
            let average = 'N/A'
            let difference = 'N/A'
            // filter to ensure that similarUsers has at least one field for the category
            const similarUsersForCategory = similarUsers.filter((user) => user[category]);
            if (similarUsersForCategory.length > 0) {
                const medianValues = similarUsersForCategory.map((user) => user[category].total_percent);
                const medianValue = median(medianValues);
                average = parseFloat(medianValue.toFixed(2));
                difference = parseFloat((roundedTotalPercent - average).toFixed(2));
            }
            rows.push({
                category: [category],
                your_percent: `${roundedTotalPercent}%`,
                your_percent_value: roundedTotalPercent,
                average: `${average}`,
                difference: `${difference}` 
            })
            for(let i=0; i < details.length; i++){
                const detail = details[i];
                let detailAverage = 'N/A';
                let detailDifference = 'N/A';
                /* extract each similar users detailed percent value if the relevant detailed field exists,
                this is checked by mapping each element of the [similarUsers] list onto a check looking for the
                relevant field name. If found, extract percent, otherwise null
                */
                const detailPercentages = similarUsersForCategory.map((user) => {
                    const userDetail = user[category].details.find(detailItem => detailItem.name === detail.name);
                    return userDetail ? userDetail.percent : null;
                });
                  // check to make sure we actually have data to take the median of, if not we have the default 'N/A'
                  if (detailPercentages.length > 0) {
                    const detailMedian = median(detailPercentages);
                    detailAverage = parseFloat(detailMedian.toFixed(2));
                    detailDifference = parseFloat((detail.percent - detailAverage).toFixed(2));
                  }

                  rows.push({
                    category: [category, detail.name],
                    your_percent: `${parseFloat(detail.percent.toFixed(2))}%`,
                    your_percent_value: parseFloat(detail.percent.toFixed(2)),
                    average: `${detailAverage}`,
                    difference: `${detailDifference}`
                  })
                }
            }
        }
    return rows;
};


/*
helper function to check if a user's password meets the requirements of containing a special character, 
upper and lower case letters, number, and length ≥ 8. If password passes all of these, return true and '' for the error message
if false, return false and the appropriate error message. Returns are structured as a dictionary with fields [valid] of type
bool to indicate password validity and [message] of type String for the error message. 
*/
export function isValidPassword(password){
    let result = {
        valid: true,
        message: ''
    }

    const specialChars= /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const nums = /[0-9]/;

    if(!specialChars.test([password])){
        result.message = 'password must have at least 1 special character'
        result.valid = false
        return result
    }

    if(!upper.test(password)){
        result.message = 'password must contain at least 1 upper case letter'
        result.valid= false
        return result
    }

    if(!lower.test(password)){
        result.message = 'password must contain at least 1 lower case letter'
        result.valid = false
        return result
    }

    if(!nums.test([password])){
        result.message = 'password must contain at least 1 number'
        result.valid = false
        return result
    }

    if(password.length < 8){
        result.message = 'password must contain at least 8 characters'
        result.valid = false
        return result
    }
    return result
}


/*
helper function to convert the dictionary form of a search object selected by a user into a 
readable URL endpoint for navigaion. Each category adheres to the following unique form factors: 
city: 'Menlo Park, CA' -> 'menloparkCA'
salary: '$87,076 - $170,050' -> '87076-170050'
job: 'Software Enigneer' -> 'SoftwareEngineer'
requires [search] to be a dictionary with fields label and category 
*/
export function searchRouteFormatter(search) {
    if(search.category === 'city'){
        let cleanedSearch = search.label.replace(/,|\s/g, '');
        cleanedSearch = cleanedSearch.slice(0, -2).toLowerCase() + cleanedSearch.slice(-2).toUpperCase();
        return cleanedSearch
    }

    else if(search.category === 'salary'){
        let cleanedSearch = search.label.replace(/,|\$|\s/g, '');
        return cleanedSearch
    }
    // if not salary or city , must be job
    else{
        let cleanedSearch = search.label
        return encodeURIComponent(cleanedSearch)
    }
}


/*
returns a json set of "similar" users transaction data. By default, a user is 'similar' if city and salary are the same
*/
export const fetchSimilarUsers = async(profileData) => {
    const profileDataJson = JSON.stringify(profileData);
    const response = await fetch(`http://localhost:3000/similar/${profileDataJson}`, 
    { method: 'GET'})
    if(!response.ok) {
      throw new Error('Network response was not ok at fetchSimilarUsers', Error);
    }
    const data = await response.json();
    return data;
  }


// helper function to return the median of an array [arr]
function median(arr) {
    const sorted = Array.from(arr).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}