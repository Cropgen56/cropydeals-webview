import React from 'react';
import { limitText } from '../../utils/textUtils';

const WeedControl = ({ weedControl, expanded, onToggleExpand }) => {
    if (!weedControl) return null;
    
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? weedControl : limitText(weedControl, 180)}
            {weedControl?.length > 180 && (
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

export default WeedControl;