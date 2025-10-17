import React, { useEffect, useState } from "react";
import CalendarWhite from "../../assets/image/farm-details/calender.svg";
import CalendarGreen from "../../assets/image/farm-details/calender-green.svg";
import { useDispatch, useSelector } from "react-redux";
import makePolygonCoordinates from "../../utils/makePolygonCoordinates ";
import { fetchIndexData } from "../../redux/slices/satelliteSlice";
import { useTranslation } from "react-i18next";

const indexKeys = [
  "TRUE_COLOR",
  "NDVI",
  "EVI",
  "EVI2",
  "SAVI",
  "MSAVI",
  "NDMI",
  "NDWI",
  "SMI",
  "CCC",
  "NDRE",
  "NITROGEN",
  "SOC",
  "SUCROSEINDEX",
  "RECI",
];

const FarmDetailsIndex = ({ farm, loading }) => {
  const dispatch = useDispatch();
  const { datesData = [], isLoading } = useSelector(
    (state) => state.satellite || {}
  );
  const { field, sowingDate } = farm || {};
  const { t } = useTranslation();

  const coordinates = makePolygonCoordinates(field);
  const [selectedIndex, setSelectedIndex] = useState("NDVI");
  const [selectedDate, setSelectedDate] = useState(null);

  // Prepare unique dates sorted by newest first
  const uniqueDates = (() => {
    const seen = new Set();
    return datesData?.items
      ?.filter((d) => d?.date && !seen.has(d.date) && seen.add(d.date))
      ?.sort((a, b) => new Date(b.date) - new Date(a.date));
  })();

  useEffect(() => {
    if (uniqueDates?.length && !selectedDate) {
      setSelectedDate(uniqueDates[0].date);
    }
  }, [uniqueDates, selectedDate]);

  // Fetch index data whenever selection changes
  useEffect(() => {
    if (!selectedDate || !selectedIndex) return;
    dispatch(
      fetchIndexData({ sowingDate, selectedDate, coordinates, selectedIndex })
    );
  }, [dispatch, sowingDate, selectedDate, selectedIndex]);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatCloud = (value) => {
    if (value === undefined || value === null || isNaN(Number(value)))
      return "-";
    const num = Number(value);

    if (num % 1 === 0) return `${num}`;
    if (Math.abs(num - Math.round(num)) < 0.05) return `${Math.round(num)}`;
    return num.toFixed(1);
  };

  if (loading || !field)
    return <div className="p-4 text-white">Loading Index...</div>;

  return (
    <div className="flex flex-col w-full bg-[#075A53] rounded-t-2xl p-3">
      <div className="flex justify-between whitespace-nowrap overflow-x-auto no-scrollbar lg:mx-8">
        {indexKeys.map((item) => (
          <button
            key={item}
            onClick={() => setSelectedIndex(item)}
            className={`text-xs sm:text-sm font-semibold px-4 md:px-0 py-1 sm:py-2 cursor-pointer transition-all duration-500 ease-in-out ${
              selectedIndex === item
                ? "text-white border-b border-white"
                : "text-[#D9D9D9]"
            }`}
          >
            {t(`indices.${item}`, item)}
          </button>
        ))}
      </div>

      <div className="flex justify-between overflow-x-auto mt-2 gap-2 no-scrollbar lg:mx-8">
        {uniqueDates?.map((item, idx) => {
          const isSelected = selectedDate === item.date;
          const cloud = item.cloud_cover ?? item.cloud_percentage ?? 0;

          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(item.date)}
              className={`flex flex-col items-center justify-center rounded-4xl px-3 py-1 sm:px-4 sm:py-2 border min-w-[110px] sm:min-w-[130px] cursor-pointer transition-all duration-500 ease-in-out ${
                isSelected
                  ? "bg-white border-white"
                  : "bg-[#0A796F] border-[#D9D9D9]"
              }`}
            >
              <div className="flex items-center gap-1 whitespace-nowrap">
                <img
                  src={isSelected ? CalendarGreen : CalendarWhite}
                  alt="calendar"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span
                  className={`text-[10px] sm:text-xs font-semibold ${
                    isSelected ? "text-[#075A53]" : "text-[#fff]"
                  }`}
                >
                  {formatDate(item.date)}
                </span>
              </div>
              <span
                className={`text-[8px] sm:text-[10px] font-semibold mt-1 ${
                  isSelected ? "text-[#075A53]" : "text-[#D9D9D9]"
                }`}
              >
                {/* {cloud}% Cloud */}
                {cloud !== null && cloud !== "-"
                  ? `${formatCloud(cloud)}% ${t("cloud")}`
                  : `- ${t("cloud")}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FarmDetailsIndex;
