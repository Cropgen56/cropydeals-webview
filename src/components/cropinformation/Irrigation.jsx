import React from 'react';
import { limitText } from '../../utils/textUtils';

const Irrigation = ({ irrigation, expanded, onToggleExpand }) => {
    if (!irrigation) return null;
    
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? irrigation : limitText(irrigation, 180)}
            {irrigation?.length > 180 && (
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

export default Irrigation;