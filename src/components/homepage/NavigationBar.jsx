import React from "react";
import {
    Community,
    CropGenBot,
    HomeIcon,
    MyFarmIcon,
    Logo,
} from "../../assets/Icons";
import bottomImage from "../../assets/bottomnavigation.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NavigationBar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex justify-around items-end w-full h-full ">
            {/* Background Image */}
            <img
                src={bottomImage}
                alt="navigation background"
                className="w-full absolute -z-10 bottom-0 left-0 right-0 h-20 md:h-24 object-cover"
            />

            {/* Bottom Navigation */}
            <div className="flex justify-around items-center p-2 md:p-4 rounded-t-[10px] fixed bottom-0 left-0 right-0 z-[100]">
                {/* Home */}
                <div className="flex flex-col items-center justify-center text-white text-sm">
                    <div
                        className="text-xl mb-1 cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <HomeIcon />
                    </div>
                    <p className="text-xs md:text-sm">{t("home")}</p>
                </div>

                {/* Community */}
                <div className="flex flex-col items-center justify-center text-white text-sm">
                    <div className="text-xl mb-1 cursor-pointer">
                        <Community />
                    </div>
                    <p className="text-xs md:text-sm">{t("community")}</p>
                </div>

                {/* Central Button */}
                <div className="relative -mt-8 text-center">
                    <div className="flex justify-center items-center">
                        <span className="ml-4 mb-5">
                            <Logo />
                        </span>
                    </div>
                </div>

                {/* My Farm */}
                <div className="flex flex-col items-center justify-center text-white text-sm">
                    <div
                        className="text-xl mb-1 cursor-pointer"
                        onClick={() => navigate("/my-farms")}
                    >
                        <MyFarmIcon />
                    </div>
                    <p className="text-xs md:text-sm">{t("myFarm")}</p>
                </div>

                {/* CropGenBot */}
                <div className="flex flex-col items-center justify-center text-white text-sm">
                    <div className="text-xl mb-1 cursor-pointer"
                        onClick={() => navigate("/cropgen-bot")}>
                        <CropGenBot />
                    </div>
                    <p className="text-xs md:text-sm">{t("cropGenBot")}</p>
                </div>
            </div>
        </div>
    );
};

export default NavigationBar;
