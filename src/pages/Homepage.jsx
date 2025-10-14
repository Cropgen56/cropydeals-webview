import React from 'react'
import Header from '../components/homepage/Header'
import WeatherCard from '../components/homepage/WeatherCard'
import NavigationBar from '../components/homepage/NavigationBar'
import MyFarm from '../components/homepage/MyFarm'
import Cropinformation from '../components/cropinformation/Cropinformation'
import MandiRate from '../components/mandirates/Mandiratesblock'
import SoilHealthReport from '../components/soilhealth/Soilhealth'


const Homepage = () => {
  return (
    <div className="w-full h-full bg-[#f8f8f8] flex flex-col items-center relative font-sans">

      <div className="w-full relative">
        <Header />
      </div>
      <div className="w-full flex justify-center absolute top-[120px] sm:top-[140px] px-4 z-20">
        <WeatherCard />
      </div>

      <div className="w-full mt-[200px] sm:mt-[200px] px-4">
        <MyFarm fields={[]} />
      </div>

      <div className="w-full mt-4">
        <Cropinformation />
      </div>


      <div className="w-full px-5">
        <SoilHealthReport />

      </div>



      <div className="w-full">
        <MandiRate />

      </div>


      <div className='mt-40'>
        <NavigationBar/>
      </div>
    </div>
  )
}

export default Homepage


