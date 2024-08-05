import {Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Profile from './ProfilePage/Profile'
import SignUp from './HomePage/SignHandlers/SignUp'
import SignIn from './HomePage/SignHandlers/SignIn';
import CreateAccount from './ProfilePage/CreateAccount'
import SearchResults from './SearchPage/SearchResults';
import Goals from './GoalPage/Goals';
import About from './AboutPage/About'
import './App.css'

function App() {
  // use this to by default route onto the menlo park page
  const menloPark = encodeURIComponent('Menlo Park, CA');
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={
          <Navigate replace to={`/search/${menloPark}`}/>
        }/>
        <Route path="/profile/:userId" element={<Profile />}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/createprofile/:userId" element={<CreateAccount/>}/>
        <Route path="/search/:searchTerm" element={<SearchResults/>}/>
        <Route path="/profile/:userId/search/:searchTerm" element={<SearchResults/>}/>
        <Route path = "/goals/:userId" element={<Goals/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/about/:userId" element={<About/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
