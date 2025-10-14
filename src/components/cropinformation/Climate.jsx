import React from 'react';

const Climate = ({ climate }) => {
    const climateData = [
        { label: "Temperature", value: climate?.temperature },
        { label: "Sowing Temp.", value: climate?.sowingTemperature },
        { label: "Rainfall", value: climate?.rainfall },
        { label: "Harvest Temp.", value: climate?.harvestingTemperature }
    ];

    return (
        <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-2 text-[10px] min-w-max">
                {climateData.map((item, index) => (
                    <div key={index} className="flex flex-col justify-center items-center p-1 border border-gray-400 rounded-lg w-28 flex-shrink-0">
                        <p className="font-medium text-emerald-800">{item.label}</p>
                        <p className="text-gray-500">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Climate;