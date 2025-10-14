import React, { memo } from 'react'
import FarmDetailsHeader from '../components/farm-details/FarmDetailsHeader';
import FarmDetailsCropHealth from '../components/farm-details/FarmDetailsCropHealth';
import FarmDetailsIndex from '../components/farm-details/FarmDetailsIndex';
import FarmDetailsCropInfo from '../components/farm-details/FarmDetailsCropInfo';
import FarmAdvisory from '../components/farm-details/FarmAdvisory';
import FarmDetailsSoilHealth from '../components/farm-details/FarmSoilHealth';
import FarmDetailsMoistureTemperature from '../components/farm-details/FarmDetailsMoistureTemperature';
import FarmDetailsWeatherCard from '../components/farm-details/FarmDetailsWeatherCard';
import FarmDetailsGrowthTimeline from '../components/farm-details/FarmDetailsGrowthTimeline';
import FarmDetailsCropProtection from '../components/farm-details/FarmDetailsCropProtection';
import FarmDetailsMarketPrice from '../components/farm-details/FarmDetailsMarketPrice';
import FarmDetailsCommunity from '../components/farm-details/FarmDetailsCommunity';
import { useLocation } from 'react-router-dom';

const MemoizedFarmDetailsHeader = memo(FarmDetailsHeader);
const MemoizedFarmDetailsCropHealth = memo(FarmDetailsCropHealth);
const MemoizedFarmDetailsCropInfo = memo(FarmDetailsCropInfo);
const MemoizedFarmAdvisory = memo(FarmAdvisory);
const MemoizedFarmDetailsSoilHealth = memo(FarmDetailsSoilHealth);
const MemoizedMoistureTemperature = memo(FarmDetailsMoistureTemperature);
const MemoizedFarmDetailsWeatherCard = memo(FarmDetailsWeatherCard);
const MemoizedFarmDetailsGrowthTimeline = memo(FarmDetailsGrowthTimeline);
const MemoizedFarmDetailsCropProtection = memo(FarmDetailsCropProtection)
const MemoizedFarmDetailsMarketPrice = memo(FarmDetailsMarketPrice);
const MemoizedFarmDetailsCommunity = memo(FarmDetailsCommunity);


function FarmDetails() {
    const location = useLocation();
    const farmData = location.state?.farm;

    if (!farmData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-xl text-gray-700">No farm data available</h2>
            </div>
        );
    }

    return (
        <div className='flex flex-col bg-[#F8F8F8]'>
            <MemoizedFarmDetailsHeader />
            <MemoizedFarmDetailsCropHealth farm={farmData}/> 
            <div className='flex-1 flex flex-col gap-4 bg-[#F8F8F8] mx-4 my-4 md:mx-6 md:my-4'>
                <MemoizedFarmDetailsCropInfo farm={farmData} />
                <MemoizedFarmAdvisory farm={farmData}/>
                <MemoizedFarmDetailsSoilHealth farm={farmData}/>
                <MemoizedMoistureTemperature farm={farmData}/>
                <MemoizedFarmDetailsWeatherCard farm={farmData}/>
                <MemoizedFarmDetailsGrowthTimeline farm={farmData}/>
                <MemoizedFarmDetailsCropProtection farm={farmData}/>
                <MemoizedFarmDetailsMarketPrice farm={farmData}/>
                <MemoizedFarmDetailsCommunity farm={farmData}/>
            </div>
        </div>
    )
}

export default FarmDetails;