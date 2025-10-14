import React from 'react';
import { limitText } from '../../utils/textUtils';

const LandPreparation = ({ landPreparation, expanded, onToggleExpand }) => {
    if (!landPreparation) return null;
    
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? landPreparation : limitText(landPreparation, 180)}
            {landPreparation?.length > 180 && (
                <button
                    onClick={onToggleExpand}
                    className="text-emerald-700 text-xs ml-2 underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </p>
    );
};

export default LandPreparation;