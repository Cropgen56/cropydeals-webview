import React, { memo } from 'react'
import FarmDetailsHeader from '../components/farm-details/FarmDetailsHeader';
import FarmDetailsCropHealth from '../components/farm-details/FarmDetailsCropHealth';
import FarmDetailsIndex from '../components/farm-details/FarmDetailsIndex';
import FarmDetailsCropInfo from '../components/farm-details/FarmDetailsCropInfo';
import FarmAdvisory from '../components/farm-details/FarmAdvisory';
import FarmDetailsSoilHealth from '../components/farm-details/FarmSoilHealth';
import FarmDetailsMoistureTemperature from '../components/farm-details/FarmDetailsMoistureTemperature';

const MemoizedFarmDetailsHeader = memo(FarmDetailsHeader);
const MemoizedFarmDetailsCropHealth = memo(FarmDetailsCropHealth);
const MemoizedFarmDetailsCropInfo = memo(FarmDetailsCropInfo);
const MemoizedFarmAdvisory = memo(FarmAdvisory);
const MemoizedFarmDetailsSoilHealth = memo(FarmDetailsSoilHealth);
const MemoizedMoistureTemperature = memo(FarmDetailsMoistureTemperature);



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
            </div>
        </div>
    )
}

export default FarmDetails;