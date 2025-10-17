import React, { useState, useRef, useEffect } from "react";
import { ChevronsUp, ChevronsDown } from "lucide-react";
import PestSvg from "../../assets/image/farm-details/pest-control.png";
import { useTranslation } from "react-i18next";

export default function FarmDetailsCropProtection() {
  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [showMore]);

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-4">
      <h3 className="text-xl md:text-2xl font-bold text-[#075A53]">
        {t("cropProtection.title")}
      </h3>

      <div className="flex flex-row items-start gap-4 md:gap-6 relative">
        <div className="w-[100px] h-[95px] flex justify-center items-center rounded-lg overflow-hidden bg-white">
          <img
            src={PestSvg}
            alt={t("cropProtection.title")}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2 relative">
          <h4 className="text-xs md:text-sm font-bold text-[#075A53]">
            {t("cropProtection.pestControl")}
          </h4>

          <div
            className={`bg-[#F8F8F8] border border-[#075A53] rounded-lg p-2 md:p-3 relative overflow-hidden transition-all duration-500`}
            style={{
              maxHeight: showMore ? contentHeight + 20 : 80,
            }}
          >
            <div ref={contentRef}>
              <h5 className="text-[10px] md:text-xs font-bold mb-1 text-black">
                {t("cropProtection.pestTitle_aphids")}
              </h5>
              <p className="text-[10px] md:text-xs text-black">
                {t("cropProtection.pestContent_aphids")}
              </p>
            </div>

            {!showMore && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#007369D6] to-transparent rounded-b-lg pointer-events-none"></div>
            )}
            <button
              onClick={() => setShowMore(!showMore)}
              className="absolute bottom-2 right-2 flex items-center gap-1 font-bold text-xs px-3 py-1 rounded transition-all ease-in-out duration-500 cursor-pointer"
              style={{
                color: showMore ? "#007369" : "#fff",
              }}
            >
              {showMore ? (
                <>
                  {t("cropProtection.show_less")}
                  <ChevronsUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t("cropProtection.show_more")}
                  <ChevronsDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
