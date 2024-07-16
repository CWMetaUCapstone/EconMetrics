import './Profile.css'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransaction } from '../../HelperFuncs/utils';
import ProfileTopBar from './ProfileTopBar';
import { fetchProfile, getRows, fetchSimilarUsers} from '../../HelperFuncs/utils';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function Profile() {
    const { userId } = useParams();
    const [transactions , setTransaction] = useState([]);
    const [profileData, setProfileData] = useState({
        'city': '',
        'salary': '',
        'roommates':'',
        'children':'',
        'job': '',
        'state': '',
        'id': ''
    })
    const [similarUsers, setSimilarUsers] = useState([]);

    // rows is initially empty since contents depend on what categories a user has data for
    const [rows, setRows] = useState([]);

    // because Category is defined below for row-grouping it's not needed here
    const [columnDefs, setColumnDefs] = useState([
        { field: "your_percent_value", headerName: "Your Percent"},
        { field: "average", headerName: "Average of Similar Users" },
        { field: "difference", headerName: "Difference Between You and Similar Average" }
    ]);

    const fetchData = async () => {
        try {
            const profile = await fetchProfile(userId);
            setProfileData(profile);
            if (profile.city != '') {
                const similarUserTransactions = await fetchSimilarUsers(profile);
                setSimilarUsers(similarUserTransactions);
                const transData = await fetchTransaction(userId);
                setTransaction(transData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    useEffect( () => {
        // guard to ensure we only create the table once transactions has been populated
        if(transactions) {
            setRows(getRows(transactions, similarUsers))
        }
    }, [transactions]);
    
    // this helper sets "Category" to be the column rows are grouped under 
    const autoGroupColumnDef = useMemo(() => {
        return {
          headerName: "Category",
          cellRendererParams: {
            suppressCount: false,
          },
        };
      }, []);
    
    /*
    this function sets the path that row data is grouped by to be the category field of row elements
    [data] is by default analagous to the rowData passed into the AG-Grid table
    */
    const getDataPath = useCallback((data) => {
    return data.category;
    }, []);
    

    return (
        <>
        <div className='TopBar'>
            <ProfileTopBar/>
        </div>
        <div className='ProfileInfo'>
            <div className='ProfileContent'>
                <h2> Profile Info </h2>
                <div className='ProfileSide'>
                    <div className='ProfilePart'>
                        <p>City: {profileData.city}, {profileData.state} </p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Salary Range: {profileData.salary}</p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Roommates: {profileData.roommates}</p>
                    </div>
                </div>
                <div className='ProfileSide'>
                    <div className='ProfilePart'>
                        <p>Children: {profileData.children}</p>
                    </div>
                    <div className='ProfilePart'>
                        <p>Job: {profileData.jobs}</p>
                    </div>
                </div>
                <button className='EditProfileBtn'>Edit Profile</button>
            </div>
        </div>
        <div className='TransactionInfo'>
        <div className='TransactionContent'>
                <h2>Transactions Info</h2>
                <div className='TransactionsTitle'>
                    <h3>Your Transactions Breakdown</h3>
                </div>
                <div className='ag-theme-alpine' style={{ height: 400, width: 800}}>
                    <AgGridReact 
                        rowData={rows}
                        columnDefs={columnDefs}
                        autoGroupColumnDef={autoGroupColumnDef}
                        treeData={true}
                        getDataPath={getDataPath}
                        groupDefaultExpanded={0}
                    />
                </div>
            </div>
        </div>
        </>
    );
}

export default Profile;