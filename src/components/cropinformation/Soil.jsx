import React from 'react';
import { limitText } from '../../utils/textUtils';

const Soil = ({ soil, expanded, onToggleExpand }) => {
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? soil : limitText(soil, 180)}
            {soil?.length > 180 && (
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

export default Soil;