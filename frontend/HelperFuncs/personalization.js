// this file contains a suite of functions to assist in recomending goals on the basis of their transaction history relative to similar users



/*
the main function of this file. This function returns a set of goals my algorithm flags as being recomended a user pursue. 
for each sub category transaction in [transaction] for which the user has a non-null value my algorithm will find:
If the user’s value is statistically significant (as measured by z-index)[4]
If the user’s value is above the interquartile range[2]
If a similar user completed a goal for this sub-category [1]
The order in which goals appear is based on the sum value of the above three criteria that they hit.

If there are no similar users, return the top 5 fields for which user expenditure was highest outside of 'investment, savings_account, and 'financial_planning'
which are considered 'good' categories which users are encouraged to increase expenditure in. 

If any of the aforementioned 'good' categories are not found in [transaction], user's are
automatically suggested to increase spending in the null category in addition to the results found from the algorithm above and the top 5

preconditions: 
[goals] is a list of goal objects which are available for the user to choose from, this is the set from which we will find goals to suggest
[transaction] is an object detailing a users most recent spending breakdown across the categories tracked in database
[similarUsers] is a list of objects which detail data and the latest transaction object for the users that were found to be similar to this user

returns:
a list of goal ojects
*/
export function findPersonalizedGoals(goals, transaction, similarUsers) {


    return []
}




