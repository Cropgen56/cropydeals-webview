import React from "react";
import { Tractor } from "lucide-react";
import MyFarmHeader from "../components/my-farms/MyFarmsHeader";
import MyFarmDetails from "../components/my-farms/MyFarmDetails";

export default function MyFarms() {
    const farms = [
        {
            id: 1,
            fieldName: "Wheat",
            cropName: "Wheat",
            sowingDate: "12/03/2025",
            acre: 2.5,
            city: "Dehradun",
            state: "Uttarakhand",
        },
        {
            id: 2,
            fieldName: "Sugarcane",
            cropName: "Sugarcane",
            sowingDate: "25/04/2025",
            acre: 3.8,
            city: "Lucknow",
            state: "Uttar Pradesh",
        },
        {
            id: 3,
            fieldName: "Cotton",
            cropName: "Cotton",
            sowingDate: "10/06/2025",
            acre: 4.2,
            city: "Patna",
            state: "Bihar",
        },
    ];

    return (
        <div className="flex flex-col bg-[#F8F8F8] min-h-screen">
            <MyFarmHeader />

            <main className="p-4 md:p-6">
                {farms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <Tractor className="text-[#075A53] w-20 h-20" />
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4 text-center">
                            No Farms Added
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 text-center mt-2 mb-6 leading-6 px-4">
                            You currently have no farms. Start by adding your first farm to
                            track and manage your fields efficiently.
                        </p>
                        <button className="bg-[#075A53] text-white font-semibold text-base md:text-lg px-6 py-3 rounded-lg hover:bg-emerald-900 transition-all ease-in-out duration-500 cursor-pointer">
                            Add Farm
                        </button>
                    </div>
                    ) : (
                    <div className="flex flex-col gap-4">
                        {farms.map((farm) => (
                            <MyFarmDetails key={farm.id} farm={farm} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
