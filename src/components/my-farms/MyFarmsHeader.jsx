import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const MyFarmHeader = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <header className="w-full bg-[#075A53] flex items-center justify-center p-4 shadow-md sticky top-0 z-50">
            <button onClick={() => navigate(-1)}
                    className="absolute left-4 p-1 cursor-pointer" >
                <ChevronLeft size={30} color="#fff" strokeWidth={2} />
            </button>

            <h1 className="text-white text-xl md:text-2xl font-bold">
                {t("myFarms")}
            </h1>
        </header>
    );
};

export default MyFarmHeader;
