// this file contains a suite of functions to assist in recommending goals on the basis of their transaction history relative to similar users

/*
the main function of this file. This function returns a set of goals my algorithm flags as being recommended a user pursue. 
for each sub category transaction in [transaction] for which the user has a non-null value my algorithm will find:
1. If the user’s value is statistically significant (as measured by z-index)[4]
2. If the user’s value is above the interquartile range[2]
3. If a similar user is tracking a goal for this sub-category[1]
The order in which goals appear is based on the sum value of the above three criteria that they hit.

If there are no similar users, return the top 5 fields for which user expenditure was highest outside of 'investment, savings_account, and 'financial_planning'
which are considered 'good' categories which users are encouraged to increase expenditure in. 

If any of the aforementioned 'good' categories are not found in [transaction], user's are
automatically suggested to increase spending in the null category in addition to the results found from the algorithm above and the top 5

preconditions: 
[goals] is a list of goal objects which are available for the user to choose from, this is the set from which we will find goals to suggest
[transaction] is an object detailing a users most recent spending breakdown across the categories tracked in database
[similarUsers] is a list of objects which detail data and the latest transaction object for the users that were found to be similar to this user

The program is designed such that users only see goals for categories that they have a non null value for. This function follows this assumption. 

returns:
a list of goal ojects
*/
export async function findPersonalizedGoals(goals, transaction, similarUsers) {
    if(similarUsers.length > 0){
        let recommendedGoals = []
        for(let i =0 ; i < goals.length ; i++){
            let score = 0
            const category = goals[i].category
            const userCategoryPercent = findUserCategoryData(transaction, category)
            const similarCategoryData = findSimilarUserCategoryData(similarUsers, category)
            if(userCategoryPercent && similarCategoryData ) {
    
                const isTracked = await isTrackedBySimilarUser(goals[i], similarUsers);
                if (isTracked) {
                    score += 1;
                }
                if(isOutsideIQR(userCategoryPercent, similarCategoryData, category)){
                    score += 2;
                }
                if(isStatisticallySignificant(userCategoryPercent, similarCategoryData, category)){
                    score += 4
                }
                if (score > 1){
                    recommendedGoals.push({goal: goals[i], score: score})
                }
            }
        }
        let sortedGoals = recommendedGoals.sort((a,b) => b.score - a.score)
        let sortedGoalsList = sortedGoals.map(ratedGoal => ratedGoal.goal);
        return sortedGoalsList
    } else {
        const topTargetedUserGoals = findTopUserGoals(transaction, goals)
        const personalizedSoloGoals = orderSoloUserGoals(topTargetedUserGoals, goals)
        return personalizedSoloGoals
    }
}


/*
helper that queries the database of users similar to this one to see if any are currently tracking [goal]
returns the boolean response to the above query
*/
const isTrackedBySimilarUser = async (goal, similarUsers) => {
    for (let i = 0; i < similarUsers.length; i++) {
        try {
            const similarUser = similarUsers[i];
            const similarId = similarUser.id;
            const response = await fetch(`http://localhost:3000/similargoals/${similarId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goal)
            });
            const trackingResponse = await response.json();
            if (trackingResponse) {
                return true
            }
        } catch (error) {
            console.error('Error finding similar users goal data:', error);
        }
    }
    return false
}


/*
returns the boolean result of whether or not the users data [userPercent] for [category] both lays outside the 
interquartile range (middle 50% of data) of [similarUserData], a list of floats representing the set
of expenditures of similar users on [category] and is in either above or below the range depending on the category.
For categories that we promote expenditure on, return true if in the bottom 25% percentile. 
For categories we promote reducing expenditure on, return true if in the top 75% percentile.
*/
function isOutsideIQR(userPercent, similarUserData, category){
    similarUserData.sort((a,b) => a-b);

    // upperQuartile is the threshold value for the 25% percentile of the similar user data set
    const upperQuartileIndex = Math.floor(0.75 * similarUserData.length)
    const upperQuartile = similarUserData[upperQuartileIndex]
   
    // lowerQuartile is the threshold value for the 25% percentile of the similar user data set
    const lowerQuartilIndex = Math.floor(0.25 * similarUserData.length)
    const lowerQuartile = similarUserData[lowerQuartilIndex]

    const interQuartileRange = upperQuartile - lowerQuartile
    // logic is reversed for the three "good" expensives, financial planning, savings account, and investment
    if((category !== 'investment' || category !== 'savings_ account' || category !== 'financial_planning')){
        return userPercent > interQuartileRange
    } else {
        // this line is analagous to being "below" the IQR
        return interQuartileRange < userPercent
    }
}

/*
returns a boolean indicating whether or not the difference between user percent and the list
of similar percents for spending on [category] is statistically signifigant as determined by a one-sample z-test
tests are either left or right tailed depending on the content of [category] to capture the different types of goals
*/
function isStatisticallySignificant(userCategoryPercent, similarCategoryData, category){
    const population = [...similarCategoryData, userCategoryPercent]
    const populationStdDev = findPopulationStandardDeviation(userCategoryPercent, similarCategoryData);
    // standard deviation cannot be negative
    if(populationStdDev < 0){
        throw new Error('negative standard deviation')
    }
    const populationMean = getAverage(population)
    const zScore = (userCategoryPercent - populationMean)/populationStdDev
    /* if goals whose category is about reducing spending, zScore should be on the positive tail
    i.e. above average to be relevant and negative for increase spending categories */
    if(zScore < 0 && (category !== 'investment' || category !== 'savings_account' || category !== 'financial_planning')){
        return false
    }
    if(zScore > 0 && (category === 'investment' || category === 'savings_account' || category === 'financial_planning')){
        return false
    }
    const pValue = standardNormalPDF(zScore, populationStdDev, populationMean)
    // pValues must always be in [0,1] if they're not, something's gone wrong
    if (pValue > 1 || pValue < 0){
        throw new Error('p value out of range')
    }
    // a .05 alpha gives us 95% confidence in our results
    const alpha = 0.05
    return pValue < alpha

}


/*
this function aggregates all similarUsers in the list [similarUsers] expenditure percentages for subcaegory [category]. 
this is done by implementing an iterative variant of depth-first search to find similar user category data
inside the nested details or "subcategory" objects. Returns a list of floats. 
*/
function findSimilarUserCategoryData(similarUsers, category){
    const matchingSimilarData = []
    similarUsers.forEach(similarTransaction => {
        const transaction = similarTransaction.transaction
        for(let parentCategory in transaction){
            const details = transaction[parentCategory].details
            for (const childCategory of details) { 
                if(childCategory.name === category){
                    matchingSimilarData.push(childCategory.percent)
                    }
            }
        }
    });
    return matchingSimilarData;
}


/*

*/
function findUserCategoryData(userData, category) {
    for (let parentCategory in userData) {
        const details = userData[parentCategory].details;
        for (const childCategory of details) {
            if (childCategory.name === category) {
                return childCategory.percent;
            }
        }
    }
}


/*
returns the mean value of [list] where [list] is an array of numbers 
*/
function getAverage(list){
    let sum = 0 
    for(let i=0 ; i < list.length; i++){
        sum += list[i]
    }
    return sum / list.length
}


/*
returns the population standard deviation for the population of expenditure data for a category
where population includes user data and similar users data at category
*/
function findPopulationStandardDeviation(userCategoryPercent, similarCategoryData){
    const combinedCategoryList = [userCategoryPercent, ...similarCategoryData]
    const populationSize = combinedCategoryList.length
    const populationMean = getAverage(combinedCategoryList)
    let totalSumOfSquares = 0
    for(let i = 0 ; i < populationSize ; i ++){
        totalSumOfSquares += Math.pow((combinedCategoryList[i] - populationMean), 2)
    }
    return Math.sqrt(totalSumOfSquares / populationSize)
}


/*
returns the numerical/general form of the normal distributions probablility distribution function at f(x). 
x: the independent variable at which we're evaluating the PDF, in practice, this is the z-score found in the z-test that preceeds this functions usage
stdDev: the population standard deviation for the population this PDF is being run on 
mean: the population mean for the population this PDF if being run on 
*/
function standardNormalPDF(x, stdDev, mean){
    const variance = Math.pow(stdDev, 2)
    return (1 / Math.sqrt(2 * Math.PI * variance) ) * Math.pow(Math.E, (-Math.pow((x-mean), 2)/(2*variance)))
}


/*
this function is used for who do not have similar users to use the more robust goal recmendation algorithm. 
Returns a sorted list of 5 goals if user has at least 5 elements otherwise returns a list equal to length of [transaction]
object which stores user expenditure data orded by percent of expenditure. 
*/
function findTopUserGoals(transaction, goals){
    let goalsList = []
    let seenCategories = new Set()
    for(let i =0 ; i < goals.length ; i++){
        const category = goals[i].category
        if(!seenCategories.has(category)){
            const userCategoryPercent = findUserCategoryData(transaction, category)
            goalsList.push({category: category, percent:userCategoryPercent})
            seenCategories.add(category)
        } 
    }
    let recommendedGoals = goalsList.sort((a,b) => b.percent - a.percent)
    if(recommendedGoals.length > 5){
        return recommendedGoals.slice(0, 5)
    }
    return recommendedGoals

}


/*
helper function that a user without similars top goal target areas, [topTargetedUserGoals], 
iterates thrugh the top goal targets to find the best available goals to match and returns these goals in the order
of priority they should be shown to the user. Namely, if a users spending in the category exceeds 5% and a goal for reducing spending 5% exists
that goal is used, if not, use the goal with the closest target value. The closest target value is used for all target areas goals
where the users spending is less than 5%
*/
function orderSoloUserGoals(topTargetedUserGoals, goals){
    const recommendedGoals = []
    for(let i = 0 ; i < topTargetedUserGoals.length ; i++){
        let goalTarget = topTargetedUserGoals[i]
        if (goalTarget.percent >= 5) {
            let goal = goals.find(g => g.category === goalTarget.category && g.target === 5);
            if (goal) {
                recommendedGoals.push(goal);
            } else {
                let closestGoal = goals.reduce((prev, curr) => {
                    return (Math.abs(curr.target - 5) < Math.abs(prev.target - 5) && curr.category === goalTarget.category) ? curr : prev;
                });
                if (closestGoal) {
                    recommendedGoals.push(closestGoal);
                }
            }
        } else {
            let closestGoal = goals.reduce((prev, curr) => {
                return (Math.abs(curr.target - goalTarget.percent) < Math.abs(prev.target - goalTarget.percent) && curr.category === goalTarget.category) ? curr : prev;
            });
            if (closestGoal) {
                recommendedGoals.push(closestGoal);
            }
        }
    }
    return recommendedGoals;
}