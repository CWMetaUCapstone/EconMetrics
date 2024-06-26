import { BrowserRouter as Router, Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import Home from './HomePage/Home'
import Profile from './ProfilePage/Profile'
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
      </Routes>
    </BrowserRouter>
  )
}

export default App;
