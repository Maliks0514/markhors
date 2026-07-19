import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/banner'
import News from '../components/News'
import JoinAcademy from '../components/JoinAcademy'
import GroundBookingHero from '../components/GroundBookingHero'
import PlayersHero from '../components/PlayersHero'
import ToursHero from '../components/ToursHero'
import FooterSection from '../components/FooterSection'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <News/>
        <JoinAcademy/>
        <GroundBookingHero/>
        <PlayersHero/>
        <ToursHero/>
        <FooterSection/>
    </div>
  )
}

export default Home