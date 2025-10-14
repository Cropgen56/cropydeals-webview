import React from 'react';
import { limitText } from '../../utils/textUtils';

const GeneralInfo = ({ generalInfo, expanded, onToggleExpand }) => {
    return (
        <div>
            <p className="text-gray-600 text-[10px] leading-snug">
                {expanded ? generalInfo : limitText(generalInfo, 200)}
            </p>
            {generalInfo?.length > 200 && (
                <button
                    onClick={onToggleExpand}
                    className="text-emerald-700 text-xs mt-1 underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
};

export default GeneralInfo;