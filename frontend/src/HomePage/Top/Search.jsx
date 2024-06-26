import './Search.css'

function Search() {
    return (
        <div className='searchbar'>

            <div className='icon'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="#F7F9FB" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
            </div>

            <input type="text" placeholder='Search by City, Job Title, or Salary' className='input'/>


        </div>
    )
}

export default Search;