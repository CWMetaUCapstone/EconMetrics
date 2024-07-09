/*
File to provide suite of client-side helpers for integrating Plaid API
*/


export const fetchLinkToken = async (userId) => {
    const response = await fetch(`http://localhost:3000/api/create_link_token/${userId}`, 
    { method: 'POST' });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.link_token;
};


export const fetchAccessToken = async (userId, public_token) => {
    const response = await fetch(`http://localhost:3000/api/exchange_public_token/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_token })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("access data", data);
    return data.access_token;
  };


export const fetchTransactions = async(userId) => {
    const response = await fetch(`http://localhost:3000/api/transactions/sync/${userId}`, 
    { method: 'GET'} );
    if(!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}
