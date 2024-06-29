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
        console.log('Error adding profile: ', error)
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
