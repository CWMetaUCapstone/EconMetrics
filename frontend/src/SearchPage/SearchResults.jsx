import './SearchResults.css'
import { useParams } from 'react-router-dom';
import Topbar from '../HomePage/Top/Topbar';
import ProfileTopBar from '../ProfilePage/ProfileTopBar';
import { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { fetchTransaction, getMatchingUsers } from '../../HelperFuncs/utils';

function SearchResults() {

    const { userId, searchTerm } = useParams();
    const [users, setUsers] = useState([]);

    const [userColumnDefs, setUserColumnDefs] = useState([
        { field: "city", headerName: "City"},
        { field: "salary", headerName: "Salary" },
        { field: "job", headerName: "Job" },
        { fields: "children", headerName: "Children/Dependents"},
        { fields: "roommates", headerName: "Roommates"}
    ]);

    const [detailsColumnDefs, setDetailsColumnDefs] = useState([
        { field: "your_percent_value", headerName: "Percent"},
    ]);


    const [userRows, setUserRows] = useState([]);
    const [detailRows, setDetailRows] = useState([]);

    const getUsers = async () => {
        try {
            const users = await getMatchingUsers(searchTerm)
            setUsers(users)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    useEffect( () => {
        getUsers(); 
    }, [searchTerm]);

    // the topbar users see depends on if they're logged in our not, as tracked by whether or not userId is in url
    const TopBarComponent = userId ? ProfileTopBar : Topbar;
    const search = decodeURIComponent(searchTerm)

    return(
        <>
            <TopBarComponent/>
            <div className='mainContent'>
                <h2>{search}</h2>
            </div>
            <div className='userList'>

            </div>
        </>
    )
}

export default SearchResults;