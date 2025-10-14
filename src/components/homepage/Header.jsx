import React from "react";
import { useSelector } from "react-redux";
import bannerimage from "../../assets/backgroundbanner.png";

const Header = () => {
  const { user, loading } = useSelector((state) => state.auth);

  return (
    <div className="relative w-full h-[180px] sm:h-[200px] bg-[#075a53] rounded-b-[40px] overflow-hidden flex items-center px-5">
      <img
        src={bannerimage}
        alt="Banner"
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
      />
      <div className="relative text-white z-10">
        <h1 className="text-lg sm:text-xl font-semibold">Welcome</h1>
        <p className="text-xl sm:text-2xl font-bold">
          {loading ? "...." : user ? `${user.firstName} ${user.lastName}` : "Guest"}
        </p>
      </div>
    </div>
  );
};

export default Header;
