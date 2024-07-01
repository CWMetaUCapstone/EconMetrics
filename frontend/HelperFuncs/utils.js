// this file contains a suite of generic helper functions for use across the program


/*
helper function to handle client-side user sign up submission
by making a post request to append new row in profile table for email and password onto 
*/
export const submitProfile = async (userData) => {
    console.log(userData)
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    } catch(error) {
        console.log('Error adding profile: ', error)
    }
}





export function nextPage() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
    }
}