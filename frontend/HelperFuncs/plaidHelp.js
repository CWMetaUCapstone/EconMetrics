/*
File to provide suite of client-side helpers for integrating Plaid API
*/


export const fetchLinkToken = async (userId) => {
    console.log("Fetching link token from server for userId:", userId);
    const response = await fetch(`http://localhost:3000/api/create_link_token/${userId}`, { method: 'POST' });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.link_token;
};