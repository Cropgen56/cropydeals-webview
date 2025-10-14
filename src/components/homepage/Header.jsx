import React, { useState } from "react";
import { useSelector } from "react-redux";
import bannerimage from "../../assets/backgroundbanner.png";
import ProfileIcon from "../../assets/image/homepage/profile.svg";
import Sidebar from "../sidebar/Sidebar";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative w-full h-[180px] sm:h-[200px] bg-[#075a53] rounded-b-[40px] overflow-hidden flex items-center px-5 text-white">
      {/* Banner background */}
      <img
        src={bannerimage}
        alt="Banner"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
      />

      {/* Profile Icon */}
      <div
        className="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-white p-2 shadow-lg"
        onClick={toggleSidebar}
      >
        <img src={ProfileIcon} alt="Profile" className="w-5 h-5" />
      </div>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Greeting Section */}
      <div className="relative z-10">
        <h1 className="text-lg sm:text-xl font-semibold">Welcome</h1>
        <p className="text-xl sm:text-2xl font-bold">
          {loading
            ? "..."
            : user
            ? `${user.firstName} ${user.lastName}`
            : "Guest"}
        </p>
      </div>
    </div>
  );
};

export default Header;
