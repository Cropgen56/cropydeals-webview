import React from 'react';
import { limitText } from '../../utils/textUtils';

const Harvesting = ({ harvesting, expanded, onToggleExpand }) => {
    if (!harvesting) return null;
    
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? harvesting : limitText(harvesting, 180)}
            {harvesting?.length > 180 && (
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

export default Harvesting;