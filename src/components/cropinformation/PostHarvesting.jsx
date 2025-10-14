import React from 'react';
import { limitText } from '../../utils/textUtils';

const PostHarvesting = ({ postHarvesting, expanded, onToggleExpand }) => {
    if (!postHarvesting) return null;
    
    return (
        <p className="text-gray-600 text-[10px]">
            {expanded ? postHarvesting : limitText(postHarvesting, 180)}
            {postHarvesting?.length > 180 && (
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

export default PostHarvesting;