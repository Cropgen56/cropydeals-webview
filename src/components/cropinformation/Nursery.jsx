import React from 'react';

const Nursery = ({ nursery }) => {
    if (!nursery) return null;
    
    return (
        <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div className="space-y-2 text-[10px]">
                {nursery.preparation && (
                    <div>
                        <span className="font-medium text-emerald-800">Preparation:</span>
                        <p className="text-gray-600 mt-1">{nursery.preparation}</p>
                    </div>
                )}
                {nursery.duration && (
                    <div>
                        <span className="font-medium text-emerald-800">Duration:</span>
                        <p className="text-gray-600 mt-1">{nursery.duration}</p>
                    </div>
                )}
                {nursery.management && (
                    <div>
                        <span className="font-medium text-emerald-800">Management:</span>
                        <p className="text-gray-600 mt-1">{nursery.management}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Nursery;