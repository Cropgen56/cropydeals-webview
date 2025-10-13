import React from 'react'
import Header from '../components/homepage/Header'
import WeatherCard from '../components/homepage/WeatherCard'
import NavigationBar from '../components/homepage/NavigationBar'


const Homepage = () => {
  return (
    <div className='h-full w-full'>
     <Header/>
     <WeatherCard/>
     <NavigationBar/>
    </div>
  )
}

export default Homepage
