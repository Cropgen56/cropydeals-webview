import React from 'react';
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ cropName }) => {
    const navigate = useNavigate();
    
    return (
        <div className="bg-emerald-800 text-white py-4 px-4 flex items-center">
            <ChevronLeft
                size={20}
                className="cursor-pointer"
                onClick={() => navigate(-1)}
            />
            <h1 className="text-lg font-semibold flex-1 text-center capitalize">
                {cropName}
            </h1>
        </div>
    );
};

export default Header;