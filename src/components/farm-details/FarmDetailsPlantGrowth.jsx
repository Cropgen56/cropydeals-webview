import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { getTheCropGrowthStage } from "../../redux/slices/satelliteSlice";
import { fetchAOIs, createAOI } from "../../redux/slices/weatherSlice";
import makePolygonCoordinates from "../../utils/makePolygonCoordinates";
import { formatToYYYYMMDD } from "../../utils/convertYYYYMMDD";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function FarmDetailsPlantGrowth({ farm }) {
  const dispatch = useDispatch();
  const { cropGrowthStage, loading } = useSelector((state) => state.satellite);
  const [currentWeek, setCurrentWeek] = useState(0);

  useEffect(() => {
    if (!farm) return;
    const fetchGrowthStage = async () => {
      try {
        const cropName = farm.cropName;
        const sowingDate = formatToYYYYMMDD(farm.sowingDate);
        const today = new Date().toISOString().split("T")[0];

        const polygonCoords = makePolygonCoordinates(farm.field);
        const payload = {
          name: farm._id,
          geometry: { type: "Polygon", coordinates: polygonCoords },
        };

        const aois = await dispatch(fetchAOIs()).unwrap();
        let existingAoi = aois.find((a) => a.name === payload.name);
        if (!existingAoi) {
          const created = await dispatch(createAOI(payload)).unwrap();
          existingAoi = created;
        }

        const growthPayload = {
          cropName,
          sowingDate,
          currentDate: today,
          geometryId: existingAoi?.id || existingAoi?._id,
        };
        await dispatch(getTheCropGrowthStage(growthPayload));
      } catch (err) {
        console.error("Growth stage fetch failed:", err);
      }
    };
    fetchGrowthStage();
  }, [farm, dispatch]);

  useEffect(() => {
    if (farm?.sowingDate) {
      const sow = new Date(farm.sowingDate);
      const now = new Date();
      const diffWeeks = Math.floor((now - sow) / (7 * 24 * 60 * 60 * 1000)) + 1;
      setCurrentWeek(diffWeeks);
    }
  }, [farm]);

  const data = Array.from({ length: 12 }, (_, i) => ({
    week: `Week ${i + 1}`,
    growth: Math.max(1, i * 0.5 + 1),
  }));

  const chartData = {
    labels: data.map((d) => d.week),
    datasets: [
      {
        label: "Growth",
        data: data.map((d) => d.growth),
        fill: true,
        borderColor: "#3A8B0A",
        backgroundColor: "rgba(58,139,10,0.12)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eee" }, ticks: { display: false } },
    },
  };

  const stage = cropGrowthStage?.finalStage?.stage || "Loading...";
  const keyActivities = cropGrowthStage?.keyActivity || [];

  return (
    <div className="bg-white rounded-xl border p-4 border-gray-200 max-w-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-emerald-800">Plant Growth Activity</h3>
          <p className="text-sm text-gray-600">{farm?.cropName || "Crop"}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 self-start">
          <span className="text-emerald-800 font-semibold">
            {`Week ${currentWeek}`}
          </span>
        </div>
      </div>

      <div className="relative mt-3 w-full h-56">
        <Line data={chartData} options={options} />
        <div className="absolute top-2 left-4 bg-white px-2 py-1 rounded shadow-sm border">
          <span className="text-sm font-medium text-emerald-800">
            Stage: {stage}
          </span>
        </div>
      </div>

      <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded p-3">
        <div className="font-semibold text-emerald-800 text-sm">{stage}</div>
        <div className="text-sm font-medium text-emerald-700 mt-2">
          Key Activities:
        </div>
        <div className="pl-2 mt-1">
          {keyActivities.length > 0 ? (
            keyActivities.map((a, i) => (
              <div key={i} className="text-sm text-emerald-800">
                • {a}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">Fetching data...</div>
          )}
        </div>
        <div className="text-sm text-gray-600 italic mt-3">
          Week {currentWeek}, Day {new Date().getDate()}
        </div>
      </div>
    </div>
  );
}
