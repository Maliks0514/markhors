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
import Tours from './pages/Tours'
import About from './pages/About'
import AdminLogin from './pages/AdminLogin'
import Login from './pages/Login'
import Signup from './pages/Signup'
import RequireAuth from './components/RequireAuth'
import MyBookings from './pages/MyBookings'
import AdminDashboard from './pages/AdminDashboard'
import NewsDetail from './pages/NewsDetail'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/news' element={<News />} />
        <Route path='/news/:id' element={<NewsDetail />} />
        <Route path='/videos' element={<Videos />} />
        <Route path='/players' element={<Players />} />
        <Route path='/academy' element={<RequireAuth><Academy /></RequireAuth>} />
        <Route path='/ground-booking' element={<RequireAuth><GroundBooking /></RequireAuth>} />
        <Route path='/tours' element={<RequireAuth><Tours /></RequireAuth>} />
        <Route path='/about' element={<About />} />
        <Route path='/my-bookings' element={<RequireAuth><MyBookings /></RequireAuth>} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
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