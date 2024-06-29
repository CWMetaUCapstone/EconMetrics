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