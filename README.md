# EconMetrics
Carson Wolber summer 2024 Meta University Capstone Project

## Project Requirements

### Your app provides multiple opportunities for you to solve technical challenges

Technical Challenge #1: 
- EconMetrics offers the ability to set and track goals. As those goals are met / missed, users are reminded of their goals.
   - goal setting is handled in the `GoalPage` folder, the ability to tracking new goals specifically is in this program flow:
     - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/GoalPage/AddableGoal.jsx#L25
     - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/GoalPage/AddableGoal.jsx#L11C2-L21C6
     - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L479-L493
   - notifications are done using `flask_mail` on the backend and they're set to run once a week along with pulling new transaction data
     https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L778-L814
     
- After goals are set, EconMetrics provides users with personalized plans to meet their goals based on user preferences, other users who have accomplished similar goals, and market conditions.
  - this goal is encapsulated in the `personalization.js` file here: https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/HelperFuncs/personalization.js

 Technical Challenge #2:
 - Users of EconMetrics want to be able to visualize their financial information and their information compared to other users.
   This goal is mostly encapsulated in the components in the Graph folder here: https://github.com/CWMetaUCapstone/EconMetrics/tree/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Graphs
   There is also a pie plot PNG showing off a users expenditure in a different visual: https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/data_handling/data_processing.py#L92-L116
- They also want to be able to customize/filter what information is pooled into the data visualized.
   - there are instances of this goal in both folders. for the `TimeChart` component this is done by regulating the `data` prop using a react-select prop
      - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L348-L350
      - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L336-L345
      - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L227-L230
  - in `CompBoxPlot` this done both directly in the graph by clicking on different parts of the graph:
      - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Graphs/CompBoxPlot.jsx#L244-L261
      - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Graphs/CompBoxPlot.jsx#L229-L242
  - as well as giving the user some external control over data visualization using two different `Checkbox` components
    - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Graphs/CompBoxPlot.jsx#L127-L227
    - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L364-L385
- In order for this visualization to be performant and responsive, we will have to implement a caching system
  - both the svg images themselve and the state of the external checkbox and react select components are cached using localStorage
    - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L223-L243
    - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L173-L181
    - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L123-L148
  Additionally the matplotlib pie plot is cached as a file in the project
    -  https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/data_handling/data_processing.py#L92-L116
    -  https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L117-L121
    -  https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L332C20-L334


## Your app interacts with a database (e.g. Parse)
- My app uses Postgres with Prisma to track four different tables as well as having an intermediary table to allow for a many to many relationship because `User` and `Goals`.
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L78-L205

## Your app integrates with at least one API (that you didn’t learn about in CodePath) – free APIs only
- my app uses three APIs, Plaid for getting a users bank account info, Back4APP for a dataset of BLS recognized occupations, and Mapbox for their address autocomplete feature.
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L52-L61
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L295-L318
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/backend/flask_routes/app.py#L815-L842
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/FormPages/PlaidLink.jsx
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/FormPages/PageOne.jsx#L96-L104
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/HelperFuncs/utils.js#L95-L124

## You can log in/log out of your app as a user
- Yes you can, once a user is logged in there's button to log out available on the topbar, conversly, if a user is not signed in there's a button to log in available on the non logged in top bar
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/HomePage/Top/Topbar.jsx#L22
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/HomePage/SignHandlers/SignIn.jsx
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/ProfileTopBar.jsx#L22

## You can sign up with a new user profile
- yes, this is managed across a few components and endpoints as a user initially creates an account with email and password and is then routed to a page that allows them to continue filling out profile data and connect their account to their bank through Plaid
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/HomePage/SignHandlers/SignUp.jsx
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/FormPages/PageOne.jsx
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/FormPages/PageTwo.jsx

## Your app has multiple views
yes my app uses a total of seven differnt routes to allows users to search if they're logged in or out and navigate the various pages of my project
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/App.jsx#L14-L27

## Your app has an interesting cursor interaction (e.g. a custom tooltip on hover)
yes, I used two different tool tips to help give users more context on their transactions
 - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L305-L314
 - https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L351-L363

## Your app demonstrates at least one component with complex visual styling (done by you, from scratch)
- yes, I think the chart components I made for my second TC are a glaring example, but another non TC realted component whose styling I'm very proud of is the Search bar with the animated dropdown for seeing results with an emoji pattern matched to the goal category
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/HomePage/Top/Search.jsx#L54-L87
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/HomePage/Top/Search.css#L41-L107

## Your app uses a loading state to create visual polish
- yes I use loading states both after connecting account to plaid and when the large amount of data based on your profile must be fetched in the profile hub component. i did these using the `react-spinner` library
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/FormPages/PlaidLink.jsx#L64-L85
- https://github.com/CWMetaUCapstone/EconMetrics/blob/e87f96ff40c9694587a0d7d77ee2a357a1ff9b0e/frontend/src/ProfilePage/Profile.jsx#L261-L429

  




## Project Planner Doc 
https://docs.google.com/document/d/1x0Bo--S4QJQHxFEerv1K9MrlYiCxGJDZhKDZ9Rg-dz0/edit?usp=sharing

## Figma Wireframes for Codepath

<img width="643" alt="Screenshot 2024-06-24 at 10 31 57 AM" src="https://github.com/CWMetaUCapstone/EconMetrics/assets/118689146/b108edd6-73f3-4572-a574-be63cb9be4d6">

<img width="514" alt="Screenshot 2024-06-24 at 10 50 03 AM" src="https://github.com/CWMetaUCapstone/EconMetrics/assets/118689146/0fd53ddc-c322-4b8e-968c-ab62176ed367">
