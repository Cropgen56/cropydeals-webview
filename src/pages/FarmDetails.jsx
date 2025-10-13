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
    return (
        <div className='flex flex-col bg-[#F8F8F8]'>
            <MemoizedFarmDetailsHeader />
            <MemoizedFarmDetailsCropHealth /> 
            <div className='flex-1 flex flex-col gap-4 bg-[#F8F8F8] mx-4 my-4 md:mx-6 md:my-4'>
                <MemoizedFarmDetailsCropInfo />
                <MemoizedFarmAdvisory />
                <MemoizedFarmDetailsSoilHealth />
                <MemoizedMoistureTemperature />
                <MemoizedFarmDetailsWeatherCard />
                <MemoizedFarmDetailsGrowthTimeline />
                <MemoizedFarmDetailsCropProtection />
                <MemoizedFarmDetailsMarketPrice />
                <MemoizedFarmDetailsCommunity />
            </div>
        </div>
    )
}

export default FarmDetails;