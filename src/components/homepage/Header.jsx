import React, { useEffect, useState } from 'react'
import bannerimage from "../../assets/backgroundbanner.png"

const Header = () => {



    return (
        <div className="relative text-white text-center m-0 p-0 h-full">
            {/* Banner Image */}
            <img
                src={bannerimage}
                alt="banner"
                className="w-full h-full object-cover md:h-60 sm:h-48"
            />


            {/* Header Content */}
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

}

export default Header
