import Home from './components/Home'
import Appointments from './components/Appointments'
import NotesFeed from './components/NotesFeed'
import MedicationPage from './components/Medications'
import SymptomTracker from './components/SymptomTracker'
import MedicalRecords from './components/MedicalRecords'
import UserInvite from './components/UserInvite'
import ProfileSettings from './components/ProfileSettings'
import PatientsDetails from './components/PatientsDetails'
import UserPage from './components/UsersPage.jsx'
import ChatPopup from './components/Chat.jsx'

import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Sidebar, { SidebarItem } from './components/Sidebar'
import {
  Library, SquareActivity, ClipboardPlus, LayoutDashboard,
  NotepadText, CalendarPlus, UserRoundPlus,
  UserRoundCog, ShieldUser, Settings
} from "lucide-react"
import Auth from './components/Auth'
import './styles/Sidebar.css'

import AcceptInvite from "./components/UserPageAcceptInvite.jsx"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    setIsLoggedIn(!!token)
  }, [])

  const publicRoutes = ['/accept-invite']

  // Allow invite page without login
  if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className='flex h-screen'>
      {!publicRoutes.includes(location.pathname) && (
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
            <SidebarItem to="/patients-details" text="Patients Details" icon={<ShieldUser size={20}/>}/>
          </SidebarItem>

          <div className="mt-auto px-4 pb-4">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to log out?")) {
                  localStorage.removeItem('userToken')
                  localStorage.removeItem('userInfo')
                  setIsLoggedIn(false)
                  navigate('/')
                }
              }}
              className="logout-btn">
              Logout
            </button>
          </div>
        </Sidebar>
      )}

      <main className='flex-1 p-4 overflow-y-auto h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/notesfeed' element={<NotesFeed />} />
          <Route path='/appointments' element={<Appointments />} />
          <Route path='/medications' element={<MedicationPage />} />
          <Route path='/symptom-tracker' element={<SymptomTracker />} />
          <Route path='/medical-records' element={<MedicalRecords />} />
          <Route path='/invite' element={<UserInvite />} />
          <Route path='/profile-settings' element={<ProfileSettings />} />
          <Route path='/patients-details' element={<PatientsDetails />} />
          <Route path='/users-account' element={<UserPage />} />
          <Route path='/accept-invite' element={<AcceptInvite onLogin={() => setIsLoggedIn(true)} />} />
        </Routes>

        {!publicRoutes.includes(location.pathname) && (
          <ChatPopup token={localStorage.getItem('userToken')} roomId={12345} />
        )}
      </main>
    </div>
  )
}

export default App
