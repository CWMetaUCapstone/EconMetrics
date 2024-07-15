import './SearchResults.css'
import { useParams } from 'react-router-dom';
import Topbar from '../HomePage/Top/Topbar';
import ProfileTopBar from '../ProfilePage/ProfileTopBar';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { getMatchingUsers, getSearchRows } from '../../HelperFuncs/utils';

function SearchResults() {

    const { userId, searchTerm } = useParams();
    const [users, setUsers] = useState([]);

    const [userColumnDefs, setUserColumnDefs] = useState([
        { field: "city", headerName: "City", cellRenderer: 'agGroupCellRenderer'},
        { field: "salary", headerName: "Salary" },
        { field: "job", headerName: "Job" },
        { field: "dependents", headerName: "Children/Dependents"},
        { field: "roommates", headerName: "Roommates"}
    ]);
    const [detailsColumnDefs, setDetailsColumnDefs] = useState([
        { field: "your_percent_value", headerName: "Percent"},
    ]);

    const [rows, setRows] = useState([]);

    const getUsers = async () => {
        try {
            const matchingUsers = await getMatchingUsers(searchTerm)
            setUsers(matchingUsers)
        } catch (error) {
            console.error('Error fetching users:', error)
        }
    }

    useEffect( () => {
        getUsers(); 
    }, [searchTerm]);

    useEffect( () => {
        if(users) {
            setRows(getSearchRows(users))
        }
    }, [users]);

    // this object describes the inner transaction table for each user
    const detailCellRendererParams = {
        detailGridOptions: {
            columnDefs: detailsColumnDefs,
            defaultColDef: {
                flex: 1
            },
            autoGroupColumnDef: {
                headerName: "Category",
                cellRendererParams: {
                    suppressCount: false,
                },
            },
            treeData: true,
            getDataPath: function(data) {
                return data.category; 
            },
            groupDefaultExpanded: 0,
        },
        getDetailRowData: function(params) {
            params.successCallback(params.data.children);
        }
    };

    const defaultColDef = useMemo(() => ({
        flex: 1,
    }), []);

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
                <div className='ag-theme-alpine' style={{ height: '100%', width: 1000 }}>
                    <AgGridReact 
                        rowData={rows}
                        columnDefs={userColumnDefs}
                        masterDetail={true}
                        detailCellRendererParams={detailCellRendererParams}
                        defaultColDef={defaultColDef}
                    />
                </div>
            </div>
        </>
    )
}

export default SearchResults;