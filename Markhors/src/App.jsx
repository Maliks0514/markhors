import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import News from './pages/News'
import Videos from './pages/Videos'
import Players from './pages/Players'
import Academy from './pages/Academy'
import GroundBooking from './pages/GroundBooking'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news' element={<News />} />
        <Route path='/videos' element={<Videos />} />
        <Route path='/players' element={<Players />} />
        <Route path='/academy' element={<Academy />} />
        <Route path='/ground-booking' element={<GroundBooking />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route
          path='/admin-dashboard'
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App