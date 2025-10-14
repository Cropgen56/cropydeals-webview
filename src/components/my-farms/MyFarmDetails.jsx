import React from "react";
import { useNavigate } from "react-router-dom"; 
import farmImage from "../../assets/image/myfarms/My-farm.svg";
import { MapPin, Pencil, SquarePen } from "lucide-react";
import location from "../../assets/image/myfarms/location-path.svg"

function MyFarmDetails({ farm }) {
  const navigate = useNavigate();

  const handleViewFarm = () => {
    navigate("/farm-details");
  };

    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl shadow-md p-5 w-full overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <img
                        src={location}
                        alt="Location"
                        className="rounded-lg object-contain w-10 h-10 md:w-12 md:h-12"
                    />
                    <div>   
                        <h2 className="text-lg md:text-xl font-bold text-[#000]">My Farm</h2>
                        <p className="text-xs text-[#A7A5A5]">
                            {farm.city}, {farm.state}
                        </p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-[#075A53] font-semibold text-sm hover:underline transition-all ease-in-out duration-500 cursor-pointer">
                    Edit Farm <SquarePen size={20} fill="#075A53" stroke="#FFFFFF" strokeWidth={2}  />
                </button>
            </div>

            <div className="flex flex-row gap-2 md:gap-4">
                <div className="w-1/3">
                    <img
                        src={farmImage}
                        alt="Farm"
                        className="rounded-lg object-contain w-full h-full"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-around w-2/3 bg-white rounded-lg p-2">
                    <DetailRow label="Farm Name" value={farm.fieldName || "N/A"} />
                    <DetailRow label="Crop" value={farm.cropName || "N/A"} />
                    <DetailRow label="Sowing Date" value={farm.sowingDate || "N/A"} />
                    <DetailRow label="Area" value={`${(farm.acre ?? 0).toFixed(2)} Acre`} />
                </div>
            </div>

            <div>
                <button onClick={handleViewFarm}
                    className="bg-[#075A53] hover:bg-[#054f48] text-white font-semibold w-full py-3 rounded-lg shadow-md transition-all ease-in-out duration-500 cursor-pointer">
                View Farm
                </button>
            </div>
        </div>
    );
}

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-gray-600 font-semibold text-[15px]">{label}</span>
        <span className="text-[#A2A2A2] font-medium text-sm">{value}</span>
    </div>
);

export default MyFarmDetails;
