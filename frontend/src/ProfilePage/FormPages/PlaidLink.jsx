import React, { useState, useEffect } from 'react';
import { usePlaidLink } from "react-plaid-link";
import { fetchLinkToken , fetchAccessToken } from '../../../HelperFuncs/plaidHelp';
import { useNavigate } from 'react-router-dom';
import './PlaidLink.css'

function PlaidLink( {userId }) {
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  /*
   when the page loads go ahead and fetch the link token which is a short-term token used to launch 
   the Plaid Link (what they call the UI component for sign in)
   */
  const fetchTokenAndOpenLink = async (userId) => {
    try {
      const linkToken = await fetchLinkToken(userId); 
      setToken(linkToken); 
    } catch (error) {
      console.error('Error fetching link token:', error);
    }
  };


  /* 
  if the plaid-handled sign in is a success, another short-term token named a 
  public token is created, this is used as another layer of authentication and can be 
  exchanged for a permanent access token which is used to continuously access account data, 
  this access token is stored as a column in the user table. 
  */
  const onSuccess = async (public_token) => {
    try {
      const access_token = await fetchAccessToken(userId , public_token)
      navigate(`/profile/${userId}`);
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
    onSuccess
  };

  const { open } = usePlaidLink(config);

  return (
    <>
      <button className='plaid-btn' onClick={() => token && open()}> 
        Connect Bank Account          &gt;
      </button>
    </>
  );
}

export default PlaidLink;
