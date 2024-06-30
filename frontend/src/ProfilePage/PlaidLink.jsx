import React, { useState, useEffect } from 'react';
import { usePlaidLink } from "react-plaid-link";
import { fetchLinkToken } from '../../HelperFuncs/plaidHelp';

function PlaidLink( {userId }) {
  const [token, setToken] = useState(null);

  // function to revtrieve 
  const fetchTokenAndOpenLink = async (userId) => {
    try {
      const linkToken = await fetchLinkToken(userId); 
      setToken(linkToken); 
    } catch (error) {
      console.error('Error fetching link token:', error);
    }
  };


  const onSuccess = async (public_token, metadata) => {
    try {
      const response = await fetch('http://localhost:3000/exchange_public_token', {
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
    } catch (error) {
      console.error('Error exchanging public token:', error);
    }
  };

  useEffect(() => {
    fetchTokenAndOpenLink(userId);
    }, [userId]); 

  useEffect(() => {
    if (token) {
      open(); 
    }
  }, [token]); 

  const config = {
    token,
    env: 'sandbox',
    onSuccess,
  };

  const { open  } = usePlaidLink(config);

  return (
    <>
      <button onClick={() => token && open()}> 
        Connect Bank Account
      </button>
    </>
  );
}

export default PlaidLink;
