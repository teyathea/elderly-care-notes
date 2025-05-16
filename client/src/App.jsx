import Home from './components/Home'
import Appointments from './components/Appointments'
import NotesFeed from './components/NotesFeed'
import Medications from './components/Medications'
import SymptomTracker from './components/SymptomTracker'
import MedicalRecords from './components/MedicalRecords'
import UsersPage from './components/UsersPage'
import ProfileSettings from './components/ProfileSettings'
import PatientsDetails from './components/PatientsDetails'

import Sidebar, {SidebarItem} from './components/Sidebar'
import './App.css'
import Auth from './components/Auth'
import { useState } from 'react'

import { Routes, Route, useNavigate } from 'react-router-dom'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)


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
          <SidebarItem to="/users-account" text="Users Account" />
              <SidebarItem to="/profile-settings" text="Profile Settings"/>
              <SidebarItem to="/patients-Details" text="Patients Details"/>

          {/* <SidebarItem to="/home" text="Settings" />
          <SidebarItem to="/home" text="Home" /> */}
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
