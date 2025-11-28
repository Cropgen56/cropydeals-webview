import React, { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchDatesData, resetState } from "../redux/slices/satelliteSlice";
import { createAOI, fetchAOIs } from "../redux/slices/weatherSlice";
import {
  fetchSmartAdvisory,
  runSmartAdvisory,
} from "../redux/slices/smartAdvisorySlice";

import makePolygonCoordinates from "../utils/makePolygonCoordinates";
import { getSixMonthsBefore } from "../utils/convertYYYYMMDD";

import FarmDetailsHeader from "../components/farm-details/FarmDetailsHeader";
import FarmDetailsCropHealth from "../components/farm-details/FarmDetailsCropHealth";
import FarmDetailsCropInfo from "../components/farm-details/FarmDetailsCropInfo";
import FarmAdvisory from "../components/farm-details/FarmAdvisory";
import FarmDetailsSoilHealth from "../components/farm-details/FarmSoilHealth";
import FarmDetailsMoistureTemperature from "../components/farm-details/FarmDetailsMoistureTemperature";
import FarmDetailsWeatherCard from "../components/farm-details/FarmDetailsWeatherCard";
import FarmDetailsGrowthTimeline from "../components/farm-details/FarmDetailsGrowthTimeline";
import FarmDetailsCropProtection from "../components/farm-details/FarmDetailsCropProtection";
import FarmDetailsPlantGrowth from "../components/farm-details/FarmDetailsPlantGrowth";

// Memoized
const MemoizedFarmDetailsHeader = memo(FarmDetailsHeader);
const MemoizedFarmDetailsCropHealth = memo(FarmDetailsCropHealth);
const MemoizedFarmDetailsCropInfo = memo(FarmDetailsCropInfo);
const MemoizedFarmAdvisory = memo(FarmAdvisory);
const MemoizedFarmDetailsSoilHealth = memo(FarmDetailsSoilHealth);
const MemoizedMoistureTemperature = memo(FarmDetailsMoistureTemperature);
const MemoizedFarmDetailsWeatherCard = memo(FarmDetailsWeatherCard);
const MemoizedFarmDetailsGrowthTimeline = memo(FarmDetailsGrowthTimeline);
const MemoizedFarmDetailsCropProtection = memo(FarmDetailsCropProtection);
const MemoizedFarmDetailsPlantGrowth = memo(FarmDetailsPlantGrowth);

function FarmDetails() {
  const location = useLocation();
  const farmData = location.state?.farm;
  const dispatch = useDispatch();

  const aois = useSelector((s) => s.weather.aois);

  const [loading, setLoading] = useState(true);

  /* ----------------------------------------
      1. Fetch satellite dates
  ----------------------------------------*/
  useEffect(() => {
    if (!farmData) return;

    (async () => {
      try {
        setLoading(true);
        dispatch(resetState());

        const polygon = makePolygonCoordinates(farmData.field);

        await dispatch(
          fetchDatesData({
            geometry: polygon.length
              ? { type: "Polygon", coordinates: polygon }
              : null,
            start_date: getSixMonthsBefore(farmData.sowingDate),
            end_date: new Date().toISOString().split("T")[0],
            provider: "both",
            satellite: "s2",
          })
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch, farmData]);

  /* ----------------------------------------
      2. Create AOI if missing
  ----------------------------------------*/
  useEffect(() => {
    if (!farmData) return;

    (async () => {
      const field = farmData.field || [];
      if (!field.length) return;

      const coords = field.map((p) => [p.lng, p.lat]);
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) coords.push(first);

      const payload = {
        name: farmData._id,
        geometry: { type: "Polygon", coordinates: [coords] },
      };

      const aoisResponse = await dispatch(fetchAOIs());
      const list = aoisResponse.payload || [];
      const exists = list.find((a) => a.name === payload.name);

      if (!exists) await dispatch(createAOI(payload));
    })();
  }, [dispatch, farmData]);

  /* ----------------------------------------
      3. Fetch Smart Advisory
  ----------------------------------------*/
  useEffect(() => {
    if (!farmData) return;
    dispatch(fetchSmartAdvisory({ fieldId: farmData._id }));
  }, [dispatch, farmData]);

  /* ----------------------------------------
      4. Run Smart Advisory once per week
  ----------------------------------------*/
  useEffect(() => {
    if (!farmData || !aois.length) return;

    const aoi = aois.find((x) => x.name === farmData._id);
    if (!aoi) return;

    const lastRunKey = `smart_adv_last_run_${farmData._id}`;
    const lastRun = Number(localStorage.getItem(lastRunKey) || 0);
    const now = Date.now();

    const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    if (now - lastRun < WEEK_MS) return;

    (async () => {
      console.log("vishla");
      await dispatch(
        runSmartAdvisory({
          fieldId: farmData._id,
          geometryId: aoi.id,
          targetDate: new Date().toISOString().split("T")[0],
          language: "en",
        })
      );

      localStorage.setItem(lastRunKey, now.toString());
      dispatch(fetchSmartAdvisory({ fieldId: farmData._id }));
    })();
  }, [aois, farmData, dispatch]);

  /* ----------------------------------------
      5. UI
  ----------------------------------------*/
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

      <div className="flex flex-col gap-4 mx-4 my-4">
        <MemoizedFarmDetailsCropInfo farm={farmData} />
        <MemoizedFarmAdvisory farm={farmData} />
        <MemoizedFarmDetailsSoilHealth farm={farmData} />
        <MemoizedMoistureTemperature farm={farmData} />
        <MemoizedFarmDetailsWeatherCard farm={farmData} />
        <MemoizedFarmDetailsGrowthTimeline farm={farmData} />
        <MemoizedFarmDetailsCropProtection farm={farmData} />
        <MemoizedFarmDetailsPlantGrowth farm={farmData} />
      </div>
    </div>
  );
}

export default FarmDetails;
