import React from "react";
import { Logo } from "../../assets/Icons";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-transparent">
            <div className="text-center p-6 rounded-lg">
                <div className="inline-block animate-rotate3d">
                    <Logo />
                </div>
                <h5 className=" text-gray-500 text-xl animate-pulsate">
                    Loading...
                </h5>
            </div>
        </div>
    );
};

export default Loading;
