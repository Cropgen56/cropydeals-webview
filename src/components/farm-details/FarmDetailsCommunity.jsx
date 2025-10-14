import React from "react";
import FarmerImg from "../../assets/image/farm-details/farmer.svg";

const CommunityTipCard = ({ userName, tip, image }) => {
  return (
    <div className="flex items-center bg-[#F8F8F8] rounded-xl p-3 border border-[#D9D9D9]">
      <img src={image} alt={userName} className="w-12 h-12 rounded-full mr-3 object-cover" />
      <div className="flex-1">
        <p className="text-black font-bold text-base mb-1">{userName}</p>
        <p className="text-[#9A9898] font-medium text-xs">{tip}</p>
      </div>
    </div>
  );
};

export default function FarmDetailsCommunity() {
  const dummyTips = [
    {
      userName: "John",
      tip: "Apply neem oil spray early morning for better pest control",
      image: FarmerImg,
    },
    {
      userName: "John Doe",
      tip: "Use drip irrigation during flowering stage for better yield",
      image: FarmerImg,
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <h3 className="text-[#075A53] font-bold text-xl md:text-2xl">
        Community Tips
      </h3>

      {dummyTips.length > 0 ? (
        dummyTips.map((tip, index) => (
          <CommunityTipCard
            key={index}
            userName={tip.userName}
            tip={tip.tip}
            image={tip.image}
          />
        ))
      ) : (
        <p className="text-[#9A9898] text-sm text-center">No tips available</p>
      )}
    </section>
  );
}
