import Home from './components/Home'
import Appointments from './components/Appointments'
import NotesFeed from './components/NotesFeed'
import Medications from './components/Medications'
import SymptomTracker from './components/SymptomTracker'
import MedicalRecords from './components/MedicalRecords'
import UsersPage from './components/UsersPage'
import ProfileSettings from './components/ProfileSettings'
import PatientsDetails from './components/PatientsDetails'

import { Routes, Route, useNavigate } from 'react-router-dom'
import Sidebar, {SidebarItem} from './components/Sidebar'
import Auth from './components/Auth'
import { useState } from 'react'
import {Library, SquareActivity, ClipboardPlus, LayoutDashboard, NotepadText, CalendarPlus, UserRoundPlus, UserRoundCog, ShieldUser, Settings } from "lucide-react"
import './App.css'
import './styles/Sidebar.css'



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)


  return (
    <>
    {!isLoggedIn ? (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      ) : (
      <div className='flex h-screen'>
        <Sidebar>
          <SidebarItem to="/home" text="Dashboard" icon={<LayoutDashboard size={20}/>} />
          <SidebarItem to="/notesfeed" text="Notes Feed" icon={<NotepadText size={20}/>} />
          <SidebarItem to="/appointments" text="Appointments" icon={<CalendarPlus size={20}/>} />
          <SidebarItem to="/medications" text="Medications" icon={<ClipboardPlus size={20}/>}/>
          <SidebarItem to="/symptom-tracker" text="Symptom Tracker" icon={<SquareActivity size={20}/>}/>
          <SidebarItem to="/medical-records" text="Medical Records" icon={<Library size={20}/>} />
          <SidebarItem to="/users-account" text="Users Account" icon={<UserRoundPlus size={20}/>} />
          <SidebarItem text="Settings" icon={<Settings size={20}/>} submenu>
              <SidebarItem to="/profile-settings" text="Profile Settings" icon={<UserRoundCog size={20}/>}/>
              <SidebarItem to="/patients-Details" text="Patients Details" icon={<ShieldUser size={20}/>}/>
          </SidebarItem>

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
            <Route path='/users-account' element={<UsersPage/>} />
            <Route path='/profile-settings' element={<ProfileSettings/>} />
            <Route path='/patients-details' element={<PatientsDetails/>} />


          </Routes>

        </main>
      </div>
      )}
    </>
  )
}

export default App
