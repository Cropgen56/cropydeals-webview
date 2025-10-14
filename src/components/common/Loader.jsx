import React from "react";
import { Logo } from "../../assets/Icons";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-transparent animate-fadeIn">
            <div className="text-center p-6 rounded-lg shadow-md bg-white animate-bounceIn">
                <Logo />
                <h5 className="mt-2 text-gray-500 text-lg animate-pulsate">Loading...</h5>
            </div>
        </div>
    );
};

export default Loading;
