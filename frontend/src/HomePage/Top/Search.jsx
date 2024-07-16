import './Search.css'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSearchResults } from '../../../HelperFuncs/utils';

function Search() {

    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // when a user first focuses on the search bar, they should see some default queries
    const defaultSearch =  [{label: 'Menlo Park, CA', category: 'city' },
                           {label: '$89,076 - $170,050', category: 'salary'},
                           {label: 'Software Engineer', category: 'job'}]

    /* search results are stored in terms of the label the user sees as well as the category of search term to allow 
    us to handle parsing unique to each category. For instance if a user enters a number like 100,000 that should be pattern
    matched to the appropriate range that number is in, or if a user searches for a city, we need to include state as well
    to ensure the user gets the exact city they're searching for
    */
    const [searchResults, setSearchResults] = useState(defaultSearch);
    const [showResults , setShowResults] = useState(false);

    // helper to route the user to the search page that matches their request
    const searchRouterHelper = (result) => {
        let searchTerm= encodeURIComponent(result.label)
        // if the user is signed in, that should be propagated into the url when they search, if not they should stay signed out
        if (location.pathname.includes('/profile/')) {
            navigate(`${location.pathname}/search/${searchTerm}`);
        } else {
            navigate(`/search/${searchTerm}`);
        }
    }

    useEffect(() => {
        // the query should be at least 3 characters long to get relevant results
        if(query.length > 2){
            getSearchResults(query)
            .then(searchResults => {
                // only change the display if there's a result to show
                if (searchResults.length > 0) {
                    setSearchResults(searchResults);
                }
            })
            .catch(error => {
                console.error('Error getting search results:', error);
            });
    }

    }, [query])

    return (
        <div className='searchContainer'>
            <div className='searchbar'>

                <div className='icon'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="#F7F9FB" className="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                    </svg>
                </div>

                <input type="text" value={query} placeholder='Search by City, Job Title, or Salary' className='input'
                onFocus={() => setShowResults(true)} 
                onBlur={() => setTimeout(() => {
                    setShowResults(false);
                    setSearchResults(defaultSearch);
                }, 150)}
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className={`results ${showResults ? 'show' : ''}`}>
                <ul>
                {searchResults.map((result, index) => (
                            <li key={index} onClick={(e) => {
                                e.stopPropagation();
                                searchRouterHelper(result)}}>
                                <div className='listContent'>
                                    {result.category === 'salary' && <p>💲</p>}
                                    {result.category === 'city' && <p>🏢</p>}
                                    {result.category === 'job' &&  <p>📄</p>}
                                    {result.label}
                                </div>
                            </li> 
                        ))}
                </ul>
            </div>
        </div>
    )
}

export default Search;