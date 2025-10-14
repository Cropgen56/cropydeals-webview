import React, { useState } from "react";
import { useSelector } from "react-redux";
import bannerimage from "../../assets/backgroundbanner.png";
import ProfileIcon from "../../assets/image/homepage/profile.svg";
import farmerimage from "../../assets/image/homepage/farmerimage.png";
import Sidebar from "../sidebar/Sidebar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative w-full h-[20rem]  text-white">
      <img
        src={bannerimage}
        alt="banner"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />


      <div
        className="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-white p-2 shadow-lg"
        onClick={toggleSidebar}
      >
        <img src={ProfileIcon} alt="Profile" className="w-5 h-5" />
      </div>


      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="absolute top-1/3 left-10 z-20 text-left">
        <h1 className="text-lg sm:text-xl font-semibold">Welcome</h1>
        <p className="text-xl sm:text-2xl font-bold">
          {loading ? "..." : user ? `${user.firstName} ${user.lastName}` : "Guest"}
        </p>
      </div>

      <div className="absolute bottom-5 right-10 z-20">
        <img
          src={farmerimage}
          alt="farmer"
          className="h-[12rem] sm:h-[14rem] object-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
