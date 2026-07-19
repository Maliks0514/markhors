import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/banner'
import News from '../components/News'
import JoinAcademy from '../components/JoinAcademy'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <News/>
        <JoinAcademy/>
    </div>
  )
}

export default Home