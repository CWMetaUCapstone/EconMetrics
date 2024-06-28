import './PageOne.css'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

function PageOne( {nextPage} ) {

    const animated = makeAnimated();

    /* 
    salary ranges are based on 2022 single-filer us tax brackets
    source: https://www.fidelity.com/learning-center/personal-finance/tax-brackets
    */
    const salary_ranges = [
        {value: '≤ $10,275', label: '≤ $10,275'},
        {value: '$10,275 - $41,775', label: '$10,275 - $41,775'},
        {value: '$41,776 - $89,075' , label: '41,776 - $89,075'}, 
        {value: '$89,076 - $170,050', label: '$89,076 - $170,050' },
        {value: '$170,051 - $215,950', label: '$170,051 - $215,950'},
        {value: '$215,951 - $539,900', label: '$215,951 - $539,900'},
        {value: '≥ $539,901', label: '≥ $539,901'}
    ]

    return (
        <>
            <div className='form-page'> 
                <div className='part-one'>
                    <label>Number of Roommates</label>
                    <input type='number' name="roommates" placeholder='Roommates' required></input>
                    <label>Address</label>
                    <input type='text' name="address" placeholder='Address' required></input> {/* in the near future this will be helped by google places for dynamic suggestions for address autocomplete */}
                </div>
                <div className='part-two'>
                    <label>Number of Children/Dependents</label>
                    <input type='number' name="children" placeholder='Children and Dependents' required></input>
                    <Select
                        placeholder="Salary Range"
                        closeMenuOnSelect={true}
                        components={animated}
                        options={salary_ranges}
                        className='salary-selector'
                        isClearable={true}
                    />
                </div>
        </div>
        <button className="continuebtn" onClick={nextPage}>Continue</button>
        </>
        
    )
}


export default PageOne;





