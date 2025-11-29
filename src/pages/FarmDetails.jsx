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

const lastRunKeyFor = (fieldId) => `lastSmartAdvisoryRun_${fieldId}`;

function getLastRunTimestamp(fieldId) {
  try {
    const v = localStorage.getItem(lastRunKeyFor(fieldId));
    return v ? Number(v) : 0;
  } catch {
    return 0;
  }
}

function setLastRunTimestamp(fieldId, ts = Date.now()) {
  try {
    localStorage.setItem(lastRunKeyFor(fieldId), String(ts));
  } catch {}
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

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

      const resp = await dispatch(fetchAOIs());
      const list = resp.payload || [];

      const exists = list.find((a) => a.name === payload.name);

      if (!exists) {
        await dispatch(createAOI(payload));
        await dispatch(fetchAOIs());
      }
    })();
  }, [dispatch, farmData]);

  useEffect(() => {
    if (!farmData?._id) return;

    dispatch(fetchSmartAdvisory({ fieldId: farmData._id }))
      .unwrap()
      .catch(() => {});
  }, [dispatch, farmData?._id]);

  const authToken = localStorage.getItem("accessToken");

  // console.log("AOIs :", aois);
  // console.log("Farm ID:", farmData?._id);
  // console.log("Farm :", farmData);

  // console.log("Token:", authToken);

  useEffect(() => {
    if (!farmData || !authToken || aois.length === 0) return;

    const matchingAOI = aois.find((a) => a.name === farmData._id);
    if (!matchingAOI || !matchingAOI.id) return;

    const geoId = matchingAOI.id;
    const fieldId = farmData._id;

    const lastTs = getLastRunTimestamp(fieldId);
    const now = Date.now();

    // run only once every 7 days
    if (lastTs && now - lastTs < WEEK_MS) return;

    const payload = {
      fieldId,
      geometryId: geoId,
      targetDate: new Date().toISOString().split("T")[0],
      language: "en",
      token: authToken,
    };

    dispatch(runSmartAdvisory(payload))
      .unwrap()
      .then(() => {
        setLastRunTimestamp(fieldId);
        dispatch(fetchSmartAdvisory({ fieldId, token: authToken })).catch(
          () => {}
        );
      })
      .catch(() => {});
  }, [farmData, aois, authToken, dispatch]);

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
