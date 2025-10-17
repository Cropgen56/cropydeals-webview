import React, { useEffect } from "react";
import { Loader, Tractor } from "lucide-react";
import MyFarmHeader from "../components/my-farms/MyFarmsHeader";
import MyFarmDetails from "../components/my-farms/MyFarmDetails";
import { useDispatch, useSelector } from "react-redux";
import { getFarmFields } from "../redux/slices/farmSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loader";

export default function MyFarms() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.user);
    const { fields, status, error } = useSelector((state) => state.farm);

    useEffect(() => {
        if (userData?.id) {
            dispatch(getFarmFields(userData.id));
        }
    }, [dispatch, userData?.id]);

    // Loading state
    if (status === "loading") {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <Loading />
                </div>
            );
    }

    // If fields array is empty, show "No Farms Added" 
    if (!fields || fields.length === 0) {
        return (
            <div className="flex flex-col bg-[#F8F8F8] min-h-screen">
                <MyFarmHeader />
                <main className="p-4 md:p-6 flex flex-col items-center justify-center">
                    <Tractor className="text-[#075A53] w-20 h-20" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4 text-center">
                        No Farms Added
                    </h2>
                    <p className="text-base md:text-lg text-gray-500 text-center mt-2 mb-6 leading-6 px-4">
                        You currently have no farms. Start by adding your first farm to track
                        and manage your fields efficiently.
                    </p>
                        <button onClick={() => navigate("/add-field")}
                                className="bg-[#075A53] text-white font-semibold text-base md:text-lg px-6 py-3 rounded-lg hover:bg-emerald-900 transition-all ease-in-out duration-500 cursor-pointer">
                        Add Farm
                    </button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-[#F8F8F8] min-h-screen">
            <MyFarmHeader />
            <main className="p-4 md:p-6 flex flex-col gap-4">
                {/* {fields.map((farm) => ( */}
                {[...fields]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((farm) => (
                    <MyFarmDetails key={farm._id} farm={farm} />
                ))}
            </main>
        </div>
    );
}
