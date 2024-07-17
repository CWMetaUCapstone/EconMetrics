import './Profile.css'
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransaction } from '../../HelperFuncs/utils';
import ProfileTopBar from './ProfileTopBar';
import { fetchProfile, getRows, fetchSimilarUsers, getSelectData, fetchHistoricalData, fetchLatestTransID, populatePlot} from '../../HelperFuncs/utils';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CanvasJSReact from '@canvasjs/react-charts';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

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

    const [canvasData, setCanvasData] = useState([]);
    const [selectData , setSelectData] = useState([]);
    const [mostRecentTransId, setMostRecentTransId] = useState(0);
    const [pieSrc , setPieSrc] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    const fetchData = async () => {
        try {
            const profile = await fetchProfile(userId);
            setProfileData(profile);
            if (profile.city != '') {
                const transId = await fetchLatestTransID(userId)
                setMostRecentTransId(transId)
                const similarUserTransactions = await fetchSimilarUsers(profile);
                setSimilarUsers(similarUserTransactions);
                const transData = await fetchTransaction(userId);
                setTransaction(transData);
                setSelectData(getSelectData(transData));
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

    useEffect(() => {
        if(mostRecentTransId != 0){
            setPieSrc(`../../public/pie_chart_${userId}_${mostRecentTransId}.png`);
        }
    }, [mostRecentTransId]); // Include userId if it's necessary for the dependency array
    
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

    const canvasOptions = {
        animationEnabled: true,	
        backgroundColor: "#f7f9f",
        title:{
            text: "Your Monthly Spending"
        },
        axisY : {
            title: "Percent of Expenditure"
        },
        axisX : {
            title: "Month"
        }, 
        toolTip: {
            shared: true
        },
        data: canvasData
    }


    useEffect(() => {
        const updateGraphs = async () => {
            if (selectedOptions.length > 0) {
                // map over all selected options and fetch each options historical data
                const plots = await Promise.all(selectedOptions.map(async (option) => {
                    const historicalData = await fetchHistoricalData(userId, option);
                    return populatePlot(historicalData, option);
                }));
                setCanvasData(plots);
            } else {
                // if no options are selected clear canvas
                setCanvasData([]);
            }
        };
    
        updateGraphs();
    }, [selectedOptions]);

    let CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const animatedComponents = makeAnimated(); 

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
                <div className='TransactionsTitle'>
                    <h3>Visualized Data</h3>
                </div>
                <div className='piePlotTitle'>
                    <h4>Your Expenditure Breakdown</h4>
                </div>
                <div className='piePlot'> 
                    <img src={pieSrc}/>
                </div>
                <div className='graphSelect'>
                    <Select
                        placeholder="Graph…"
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={selectData}
                        isClearable={true}
                        className='graphSelector'
                        isMulti
                        onChange={setSelectedOptions}
                    />
                </div>
                <div className='canvasChart'>
                <CanvasJSChart options = {canvasOptions}
			    />
                </div>
            </div>
        </div>
        </>
    );
}

export default Profile;