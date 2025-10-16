import React, { memo, useEffect, useState } from "react";
import FarmDetailsHeader from "../components/farm-details/FarmDetailsHeader";
import FarmDetailsCropHealth from "../components/farm-details/FarmDetailsCropHealth";
import FarmDetailsIndex from "../components/farm-details/FarmDetailsIndex";
import FarmDetailsCropInfo from "../components/farm-details/FarmDetailsCropInfo";
import FarmAdvisory from "../components/farm-details/FarmAdvisory";
import FarmDetailsSoilHealth from "../components/farm-details/FarmSoilHealth";
import FarmDetailsMoistureTemperature from "../components/farm-details/FarmDetailsMoistureTemperature";
import FarmDetailsWeatherCard from "../components/farm-details/FarmDetailsWeatherCard";
import FarmDetailsGrowthTimeline from "../components/farm-details/FarmDetailsGrowthTimeline";
import FarmDetailsCropProtection from "../components/farm-details/FarmDetailsCropProtection";
import FarmDetailsMarketPrice from "../components/farm-details/FarmDetailsMarketPrice";
import FarmDetailsCommunity from "../components/farm-details/FarmDetailsCommunity";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCropHealth, fetchDatesData, resetState } from "../redux/slices/satelliteSlice";

const MemoizedFarmDetailsHeader = memo(FarmDetailsHeader);
const MemoizedFarmDetailsCropHealth = memo(FarmDetailsCropHealth);
const MemoizedFarmDetailsCropInfo = memo(FarmDetailsCropInfo);
const MemoizedFarmAdvisory = memo(FarmAdvisory);
const MemoizedFarmDetailsSoilHealth = memo(FarmDetailsSoilHealth);
const MemoizedMoistureTemperature = memo(FarmDetailsMoistureTemperature);
const MemoizedFarmDetailsWeatherCard = memo(FarmDetailsWeatherCard);
const MemoizedFarmDetailsGrowthTimeline = memo(FarmDetailsGrowthTimeline);
const MemoizedFarmDetailsCropProtection = memo(FarmDetailsCropProtection);
const MemoizedFarmDetailsMarketPrice = memo(FarmDetailsMarketPrice);
const MemoizedFarmDetailsCommunity = memo(FarmDetailsCommunity);
import makePolygonCoordinates from "../utils/makePolygonCoordinates ";
import {formatToYYYYMMDD} from "../utils/convertYYYYMMDD"
import { createAOI, fetchAOIs } from "../redux/slices/weatherSlice";

function FarmDetails() {
  const location = useLocation();
  const farmData = location.state?.farm;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!farmData) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        dispatch(resetState());

        const { field } = farmData;
        const polygonCoords = makePolygonCoordinates(field);
        const geometry = polygonCoords.length
          ? { type: "Polygon", coordinates: polygonCoords }
          : null;

        const availabilityPayload = {
          geometry,
          start_date: farmData?.sowingDate,
          end_date: formatToYYYYMMDD(new Date()),
          provider: "both",
          satellite: "s2",
        };

        await dispatch(fetchDatesData(availabilityPayload));
        await dispatch(fetchCropHealth(polygonCoords));
      } catch (error) {
        console.error("FarmDetails satellite fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, farmData]);

  // AOI creation logic
  useEffect(() => {
    if (!farmData) return;

    const field = farmData.field || [];
    if (!Array.isArray(field) || field.length === 0) return;

    const geometryCoords = field.map((p) => [p.lng, p.lat]);
    const first = geometryCoords[0];
    const last = geometryCoords[geometryCoords.length - 1];
    if (!last || first[0] !== last[0] || first[1] !== last[1])
      geometryCoords.push(first);

    const payload = {
      name: farmData._id,
      geometry: { type: "Polygon", coordinates: [geometryCoords] },
    };

    (async () => {
      try {
        const action = await dispatch(fetchAOIs());
        const fetchedAoIs = action?.payload ?? null;
        let existing = null;

        if (Array.isArray(fetchedAoIs)) {
          existing = fetchedAoIs.find((a) => a.name === payload.name);
        } else {
          const stateAoIs = dispatch?.getState?.()?.weather?.aois ?? null;
          if (Array.isArray(stateAoIs))
            existing = stateAoIs.find((a) => a.name === payload.name);
        }

        if (!existing) await dispatch(createAOI(payload));
      } catch (err) {
        console.warn("AOI creation flow error:", err);
      }
    })();
  }, [dispatch, farmData]);

  if (!farmData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl text-gray-700">No farm data available</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#F8F8F8]">
      <MemoizedFarmDetailsHeader />
      <MemoizedFarmDetailsCropHealth farm={farmData} loading={loading} />
      <div className="flex-1 flex flex-col gap-4 bg-[#F8F8F8] mx-4 my-4 md:mx-6 md:my-4">
        <MemoizedFarmDetailsCropInfo farm={farmData} />
        <MemoizedFarmAdvisory farm={farmData} />
        <MemoizedFarmDetailsSoilHealth farm={farmData} />
        <MemoizedMoistureTemperature farm={farmData} />
        <MemoizedFarmDetailsWeatherCard farm={farmData} />
        <MemoizedFarmDetailsGrowthTimeline farm={farmData} />
        <MemoizedFarmDetailsCropProtection farm={farmData} />
        <MemoizedFarmDetailsMarketPrice farm={farmData} />
        {/* <MemoizedFarmDetailsCommunity farm={farmData} /> */}
      </div>
    </div>
  );
}

export default FarmDetails;
