import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function FarmAdvisory({ farm }) {
  const { advisory, loading } = useSelector(state => state.smartAdvisory);
  const { t } = useTranslation();

  const advisoryArray = useMemo(() => {
    return advisory?.smartAdvisory?.weeklyAdvisory?.items || [];
  }, [advisory]);

  if (loading) return <p>{t("loading_advisory")}</p>;
  if (!advisoryArray.length) return <p>{t("no_advisory_available")}</p>;

  return (
    <section className="w-full bg-white border border-[#D9D9D9] rounded-xl md:px-8 p-4 flex flex-col gap-4">
      <h2 className="text-lg sm:text-xl font-bold text-[#075A53]">Weekly Advisory</h2>

      {advisoryArray.map((item, index) => (
        <div
          key={index}
          className="border border-[#075A53] bg-[#F8F8F8] rounded-lg p-4"
        >
          <p className="text-[#075A53] text-sm font-bold capitalize">
            {item.key.replace(/_/g, " ")}
          </p>
          <p className="text-[#263238] text-sm leading-5">{item.advice}</p>
        </div>
      ))}
    </section>
  );
}

export default FarmAdvisory;
