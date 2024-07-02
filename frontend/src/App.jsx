import {Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './HomePage/Home'
import Profile from './ProfilePage/Profile'
import SignUp from './HomePage/SignHandlers/SignUp'
import SignIn from './HomePage/SignHandlers/SignIn';
import CreateAccount from './ProfilePage/CreateAccount'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Navigate replace to="/home"/>
        }/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/home/:userId"/>
        <Route path="/profile/:userId" element={<Profile />}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/createprofile/:userId" element={<CreateAccount/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
