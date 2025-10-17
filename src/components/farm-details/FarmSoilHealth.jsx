import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getNpkData } from "../../redux/slices/satelliteSlice";
import NutrientBar from "./NutrientBar";
import FertilizerRecommendation from "./fertilizerRecommendation";
import { formatToYYYYMMDD } from "../../utils/convertYYYYMMDD";
import { useTranslation } from "react-i18next";

const NUTRIENT_CONFIG = [
  { symbol: "N", label: "nitrogen", key: "N" },
  { symbol: "P", label: "phosphorous", key: "P" },
  { symbol: "K", label: "potassium", key: "K" },
];

const FarmDetailsSoilHealth = ({ farm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const lastPayloadRef = useRef(null);

  const aois = useSelector((state) => state.weather?.aois ?? [], shallowEqual);
  const newNpkData = useSelector(
    (state) => state.satellite?.newNpkData ?? {},
    shallowEqual
  );
  const npkLoading = useSelector(
    (state) => state.satellite?.isLoading?.newNpkData
  );

  const { cropName, sowingDate, field, _id: farmId } = farm;

  const endDate = useMemo(() => formatToYYYYMMDD(new Date()), []);

  const nutrientData = useMemo(() => {
    const stageTarget = newNpkData?.data?.stage_target ?? {};
    const estimatedUptake = newNpkData?.data?.estimated_uptake ?? {};

    return NUTRIENT_CONFIG.map((n) => ({
      symbol: n.symbol,
      label: t(n.label),
      current: estimatedUptake[n.key] || 0,
      required: stageTarget[n.key] || 0,
    }));
  }, [newNpkData]);

  const fertilizerPlan = useMemo(
    () => newNpkData?.data?.fertilizer_plan ?? {},
    [newNpkData]
  );

  // convert field to polygon coords
  const convertFieldToCoordinates = (field = []) => {
    if (!Array.isArray(field) || field.length === 0) return [];
    const coords = field.map(({ lng, lat }) => [lng, lat]);
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (!last || first[0] !== last[0] || first[1] !== last[1])
      coords.push(first);
    return [coords];
  };

  // Fetch NPK data
  useEffect(() => {
    if (!cropName || !sowingDate || !farmId || !aois.length) return;

    const matchingAoi = aois.find((a) => a.name === farmId);
    if (!matchingAoi?.id) return;

    const payload = {
      crop: cropName,
      startDate: formatToYYYYMMDD(sowingDate),
      endDate,
      geometry_id: matchingAoi.id,
      geometryCoords: convertFieldToCoordinates(field),
    };

    const payloadKey = JSON.stringify(payload);
    if (lastPayloadRef.current === payloadKey) return;
    lastPayloadRef.current = payloadKey;

    dispatch(getNpkData(payload));
  }, [cropName, sowingDate, farmId, aois, endDate, field, dispatch]);

  return (
    <section className="bg-white rounded-xl border border-[#E6EEF0] md:px-8 p-4 flex flex-col gap-4">
      <h2 className="text-base sm:text-xl font-bold text-[#075A53]">
        {t("soilHealth")}
      </h2>

      <div className="flex justify-end gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[#36A534]" />
          <span>{t("current")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[#C4E930]" />
          <span>{t("required")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {npkLoading ? (
          <p>Loading...</p>
        ) : (
          nutrientData.map((n) => (
            <NutrientBar
              key={n.symbol}
              symbol={n.symbol}
              label={n.label}
              current={n.current}
              required={n.required}
            />
          ))
        )}
      </div>

      <FertilizerRecommendation
        fertilizerPlan={fertilizerPlan || {}}
        stageTarget={newNpkData?.data?.stage_target || {}}
      />

      <div className="bg-[#F8F8F8] border border-[#D9D9D9] rounded-xl p-3 text-sm text-[#344E41] font-medium">
        {newNpkData?.data?.notes || t("noAdditionalFertilizer")}
      </div>
    </section>
  );
};

export default FarmDetailsSoilHealth;
