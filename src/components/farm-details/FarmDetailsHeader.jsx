import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, UserCircle } from "lucide-react";
import profileIcon from "../../assets/image/farm-details/profile.svg"

const FarmDetailsHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="w-full bg-[#075a53] flex items-center justify-between px-4 py-2 shadow-md sticky top-0 z-[1999]">
            <button onClick={() => navigate(-1)}
                    className="p-1 cursor-pointer">
                <ChevronLeft size={30} color="#fff" strokeWidth={2} />
            </button>

            <div className="flex items-center gap-3">
                <button className="p-1 cursor-pointer">
                    <Bell size={20} color="#fff" fill="#fff" />
                </button>
                <button className="p-1 cursor-pointer">
                    <img
                        src={profileIcon}
                        alt="Profile"
                        className="w-5 h-5"
                    />
                </button>
            </div>
        </header>
    );
};

export default FarmDetailsHeader;
