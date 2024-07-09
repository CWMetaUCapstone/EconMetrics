import './Profile.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransactions } from '../../HelperFuncs/plaidHelp';

function Profile() {
    const { userId } = useParams();
    const [transactions , setTransaction] = useState({});

    const getTransactions = async () => {
        try {
            const transData = await fetchTransactions(userId);
            setTransaction(transData)
        } catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }

    useEffect( () => {
        getTransactions();
    }, []);

    return (
        <div>

        </div>
    );
}

export default Profile;