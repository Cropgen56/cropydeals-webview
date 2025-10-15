import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { X } from "lucide-react";

import userImg from "../../assets/image/sidebar/user-img.svg";
import languageIcon from "../../assets/image/sidebar/language.svg";
import { AddFieldIcon } from "../../assets/Icons"
import { ProfileIcon } from "../../assets/Icons"
import logoutIcon from "../../assets/image/sidebar/logout.svg";

const Sidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLanguageClick = () => {
        onClose();
        navigate("/preferred-language");
    };

    //   const handleLogout = () => {
    //     dispatch(logout());
    //     onClose();
    //     navigate("/"); // redirect to homepage or login link
    //   };

    return (
        <>
            {/* Overlay background */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-full p-5 w-64 bg-[#075A53] shadow-xl z-150 transform transition-transform duration-500 flex flex-col justify-between gap-4 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header section */}
                <div
                    
                    onClick={()=>{
                        navigate("/profile")
                    }}
                    className="flex flex-row gap-x-4 pb-2"
                    style={{
                        borderBottom: "1px solid",
                        borderImageSlice: 1,
                        borderImageSource:
                            "linear-gradient(90deg, #075A53 0%, #FFFFFF 50%, #075A53 100%)",
                    }}
                >
                    <img
                        src={userImg}
                        alt="User Image"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start justify-center text-white">
                        <span className="font-semibold text-base">
                            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
                        </span>
                        <span className="text-sm">{user?.email || "guest@example.com"}</span>
                    </div>
                </div>

                <ul className="flex flex-col gap-4">

                    <li
                        className="flex items-center gap-2 cursor-pointer text-white"
                        onClick={() => {
                            navigate("/my-farms")
                        }}
                    >
                        <AddFieldIcon />
                        My Farms
                    </li>

                    <li
                        className="flex items-center gap-2 cursor-pointer text-white"
                        onClick={handleLanguageClick}
                    >
                        <img src={languageIcon} alt="Language" className="w-6 h-6" />
                        Language
                    </li>
                    
                </ul>

                {/* Footer / Logout */}
                <div
                    className="flex flex-col gap-4 mt-auto pt-4"
                    style={{
                        borderTop: "1px solid",
                        borderImageSlice: 1,
                        borderImageSource:
                            "linear-gradient(90deg, #075A53 0%, #FFFFFF 50%, #075A53 100%)",
                    }}
                >
                    <li
                        className="flex items-center gap-2 cursor-pointer text-white"
                    // onClick={handleLogout}
                    >
                        <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
                        Logout
                    </li>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
