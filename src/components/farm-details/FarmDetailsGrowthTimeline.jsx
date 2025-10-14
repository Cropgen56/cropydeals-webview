import React from "react";
import FruitImg from "../../assets/image/farm-details/fruit.png";
import HarvestImg from "../../assets/image/farm-details/harvest.png";
import SowingImg from "../../assets/image/farm-details/sowing.svg";
import GrowthImg from "../../assets/image/farm-details/growth.svg";
import FlowerImg from "../../assets/image/farm-details/flower.svg";
import TickImg from "../../assets/image/farm-details/tick.png";
import { useTranslation } from "react-i18next";

export default function FarmDetailsGrowthTimeline() {
  const { t } = useTranslation();

const stages = [
  {
    id: 1,
    label: "Sowing",
    active: true,
    image: <img src={SowingImg} alt="sowing" className="w-7 h-7" />,
  },
  {
    id: 2,
    label: "Growth",
    active: true,
    image: <img src={GrowthImg} alt="growth" className="w-7 h-7" />,
  },
  {
    id: 3,
    label: "Flower",
    active: true,
    image: <img src={FlowerImg} alt="flower" className="w-7 h-7" />,
  },
  {
    id: 4,
    label: "Fruit",
    active: false,
    image: <img src={FruitImg} alt="fruit" className="w-7 h-7 object-contain" />,
  },
  {
    id: 5,
    label: "Harvest",
    active: false,
    image: <img src={HarvestImg} alt="harvest" className="w-7 h-7 object-contain" />,
  },
];

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <h3 className="text-xl font-bold text-[#075A53]">Growth Timeline</h3>

      <div className="flex gap-4 md:justify-center overflow-x-auto items-center relative no-scrollbar">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex flex-col items-center relative min-w-[55px] md:min-w-[90px]"
          >
            <div
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center z-10 relative ${
                stage.active
                  ? "bg-[#075A53] border-[#075A53]"
                  : "bg-[#D9D9D9] border-[#075A53]"
              }`}
            >
              {stage.image}

              {stage.active && (
                <div className="absolute inset-0 bg-[#075A53]/10 rounded-full flex items-center justify-center">
                  <img
                    src={TickImg}
                    alt="tick"
                    className="w-7 h-7 object-contain"
                  />
                </div>
              )}
            </div>

            <span
              className={`mt-2 text-xs font-semibold text-center ${
                stage.active ? "text-[#075A53] font-bold" : "text-[#9A9898]"
              }`}
            >
              {stage.label}
            </span>

            {index < stages.length - 1 && (
              <div className="absolute top-6 right-[-50%] w-9 h-[2px] md:w-16 bg-[#9A9898] z-0"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
