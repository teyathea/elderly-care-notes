import Home from './components/Home'
import Appointments from './components/Appointments'
import NotesFeed from './components/NotesFeed'
import Medications from './components/Medications'
import SymptomTracker from './components/SymptomTracker'
import MedicalRecords from './components/MedicalRecords'
import UserInvite from './components/UserInvite'
import ProfileSettings from './components/ProfileSettings'
import PatientsDetails from './components/PatientsDetails'
import UserPage from './components/UsersPage.jsx'

import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar, {SidebarItem} from './components/Sidebar'
import Auth from './components/Auth'

import AcceptInvite from "./components/UserPageAcceptInvite.jsx";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) setIsLoggedIn(true)
  }, []);

  return (
    <>
    {!isLoggedIn ? (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      ) : (
      <div className='flex h-screen'>
        <Sidebar>
          <SidebarItem to="/home" text="Home" />
          <SidebarItem to="/notesfeed" text="Notes Feed" />
          <SidebarItem to="/appointments" text="Appointments" />
          <SidebarItem to="/medications" text="Medications" />
          <SidebarItem to="/symptom-tracker" text="Symptom Tracker" />
          <SidebarItem to="/medical-records" text="Medical Records" />
          <SidebarItem to="/users" text="Users Account" />
              <SidebarItem to="/profile-settings" text="Profile Settings"/>
              <SidebarItem to="/patients-Details" text="Patients Details"/>

          <div className="mt-auto px-4 pb-4">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")){
                  setIsLoggedIn(false)
                }
              }}
              className="logout-btn">
              Logout
            </button>
          </div>
        </Sidebar>

        <main className='flex-1 p-4'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/notesfeed' element={<NotesFeed/>} />
            <Route path='/appointments' element={<Appointments/>} />
            <Route path='/medications' element={<Medications/>} />
            <Route path='/symptom-tracker' element={<SymptomTracker/>} />
            <Route path='/medical-records' element={<MedicalRecords/>} />
            <Route path='invite' element={<UserInvite/>} />
            <Route path='/profile-settings' element={<ProfileSettings/>} />
            <Route path='/patients-details' element={<PatientsDetails/>} />
            <Route path="/accept-invite" element={<AcceptInvite onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/invite" element={<AcceptInvite />} />
            <Route path='/users' element={<UserPage />} />
          </Routes>

        </main>
      </div>
      )}
    </>
  )
}

export default App
