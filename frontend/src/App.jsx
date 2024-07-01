import {Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './HomePage/Home'
import Profile from './ProfilePage/Profile'
import SignUp from './HomePage/SignHandlers/SignUp'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Navigate replace to="/home"/>
        }/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile:userId" element={<Profile />}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
