import React, { useEffect, useState } from "react";
import bannerimage from "../../assets/backgroundbanner.png";
import ProfileIcon from "../../assets/image/homepage/profile.svg";
import Sidebar from "../sidebar/Sidebar";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="relative text-white text-center m-0 p-0 h-full">
            <img
                src={bannerimage}
                alt="banner"
                className="w-full h-full object-cover md:h-60 sm:h-48"
            />
            <div className="absolute top-8 right-4 z-30 cursor-pointer rounded-full bg-white p-2 shadow-lg"
                onClick={toggleSidebar}>
                <img
                    src={ProfileIcon}
                    alt="Profile"
                    className="w-5 h-5"
                />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] flex flex-row justify-between items-center sm:flex-col sm:top-[40%] font-semibold text-2xl ">
                {/* Greeting */}
                <div className="text-left sm:text-start">
                    <h1 className="text-xl sm:text-2xl mt-2 font-semibold justify-center flex flex-row">
                        Welcome
                    </h1>
                    Vishal
                </div>
            </div>
            hello
        </div>
    );
};

export default Header;
