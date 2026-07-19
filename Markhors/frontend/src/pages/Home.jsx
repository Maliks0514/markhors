import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/banner'
import News from '../components/News'
import JoinAcademy from '../components/JoinAcademy'
import GroundBookingHero from '../components/GroundBookingHero'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <News/>
        <JoinAcademy/>
        <GroundBookingHero/>
    </div>
  )
}

export default Home