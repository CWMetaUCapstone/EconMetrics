import './Profile.css'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTransaction } from '../../HelperFuncs/utils';
import ProfileTopBar from './ProfileTopBar';
import { fetchProfile, getRows, fetchSimilarUsers, getSelectData, fetchHistoricalData, fetchLatestTransID} from '../../HelperFuncs/utils';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-charts-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Chart from './Chart';


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

    const [chartData, setChartData] = useState([]);
    const [selectData , setSelectData] = useState([]);
    const [mostRecentTransId, setMostRecentTransId] = useState(0);
    const [pieSrc , setPieSrc] = useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    // chart is cached as a url so selected options persist on graph for refresh
    const [chartSVG, setChartSVG] = useState('');

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

    useEffect(() => {
        // retrieve and set svg src and selected options from localStorage if there's data saved
        const savedOptions = localStorage.getItem('selectedOptions');
        const savedSVG = localStorage.getItem('chartSVG');
        if (savedOptions) {
            setSelectedOptions(JSON.parse(savedOptions));
        }
        if (savedSVG) {
            const imgSrc = `data:image/svg+xml;base64,${btoa((encodeURIComponent(savedSVG)))}`;
            setChartSVG(imgSrc);
        }
    }, []);
    
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


    useEffect(() => {
        if (selectedOptions.length > 0) {
            getHistory(selectedOptions);
        } else {
            // clear chartData if there are no selected options
            setChartData([]);
        }
    }, [selectedOptions]);
    
    const getHistory = async (options) => {
        // Fetch historical data for all selected options
        const dataPromises = options.map(option =>
            fetchHistoricalData(userId, option.value) // Pass the value of each option to the fetch function
        );
        const results = await Promise.all(dataPromises);
        const combinedData = results.flat();
        setChartData(combinedData); // Update the chart data with combined results from all selected options
    };

    const animatedComponents = makeAnimated(); 

    /* when a new graph selection is made / deleted, set select options to match
    the value of selectedOptions, tracked through the [options] parameter. 
    The [selectedOptions] item in localStorage is also set to match this change
    */
    const handleSelectChange = (options) => {
        setSelectedOptions(options);
        localStorage.setItem('selectedOptions', JSON.stringify(options));
    };

    const saveSvgToLocalStorage = (svgElement) => {
        // svg is saved in local storage as a src url
        const svgData = new XMLSerializer().serializeToString(svgElement);
        localStorage.setItem('chartSVG', svgData);
        setChartSVG(svgData);
    };


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
                        onChange={handleSelectChange}
                        value={selectedOptions}
                    />
                </div>
                <div className='chart'>
                    <Chart data={chartData} onSaveSvg={saveSvgToLocalStorage}/>
                </div>
                {chartSVG && <img src={chartSVG}/>}
            </div>
        </div>
        </>
    );
}

export default Profile;