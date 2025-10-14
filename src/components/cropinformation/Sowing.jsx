import React from 'react';

const Sowing = ({ sowing }) => {
    if (!sowing) return null;

    const sowingFields = [
        { label: "Time", value: sowing.time },
        { label: "Spacing", value: sowing.spacing },
        { label: "Method", value: sowing.method },
        { label: "Depth", value: sowing.depth },
        { label: "Seed Rate", value: sowing.seedRate }
    ];

    return (
        <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
            <div className="space-y-2 text-[10px]">
                {sowingFields.map((field, index) => 
                    field.value && (
                        <div key={index} className="flex">
                            <span className="w-36 font-medium text-emerald-800">{field.label}:</span>
                            <span className="text-gray-600">{field.value}</span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Sowing;