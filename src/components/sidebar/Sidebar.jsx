import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigate
import { X } from "lucide-react";
import user from "../../assets/image/sidebar/user-img.svg";
import language from "../../assets/image/sidebar/language.svg";
import logout from "../../assets/image/sidebar/logout.svg";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLanguageClick = () => {
    onClose(); 
    navigate("/preferred-language"); 
  };

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}> </div>
            <div className={`fixed right-0 top-0 h-full p-5 w-64 bg-[#075A53] shadow-xl z-999 transform transition-transform duration-500 flex flex-col justify-between gap-4 ${
                isOpen ? "translate-x-0" : "translate-x-full" }`} >
                <div className="flex flex-row gap-x-4 pb-2"
                    style={{
                        borderBottom: "1px solid",
                        borderImageSlice: 1,
                        borderImageSource:
                        "linear-gradient(90deg, #075A53 0%, #FFFFFF 50%, #075A53 100%)",
                    }} >
                    <img
                        src={user}
                        alt="User Image"
                        className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start justify-center">
                        <span className="font-semibold text-white text-base">Garima</span>
                        <span className="text-white text-sm">guest@example.com</span>
                    </div>
                </div>

                <ul className="flex flex-col gap-4">
                    <li className="flex items-center gap-2 cursor-pointer text-white"
                        onClick={handleLanguageClick}>
                        <img src={language} alt="Language" className="w-6 h-6" />
                        Language
                    </li>
                </ul>

                <div className="flex flex-col gap-4 mt-auto pt-4"
                    style={{
                        borderTop: "1px solid",
                        borderImageSlice: 1,
                        borderImageSource:
                        "linear-gradient(90deg, #075A53 0%, #FFFFFF 50%, #075A53 100%)",
                    }} >
                    <li className="flex items-center gap-2 cursor-pointer text-white">
                        <img src={logout} alt="Logout" className="w-6 h-6" />
                        Logout
                    </li>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
