import React from 'react';

const Varieties = ({ varieties, selectedVariety, onVarietyChange }) => {
    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                {varieties?.length > 0 && (
                    <select
                        value={selectedVariety?.name || ""}
                        onChange={(e) => {
                            const variety = varieties.find((v) => v.name === e.target.value);
                            onVarietyChange(variety);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-[10px]"
                    >
                        {varieties.map((v, i) => (
                            <option key={i} value={v.name}>
                                {v.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedVariety && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                    <div className="space-y-2 text-[10px]">
                        <div className="flex">
                            <span className="w-36 font-medium text-[10px] text-emerald-800">Description:</span>
                            <span className="text-gray-700 text-[10px]">{selectedVariety.description}</span>
                        </div>
                        {"maturityDays" in selectedVariety && (
                            <div className="flex">
                                <span className="w-36 font-medium text-[10px] text-emerald-800">Maturity Days:</span>
                                <span className="text-gray-700 text-[10px]">{selectedVariety.maturityDays}</span>
                            </div>
                        )}
                        {"yield" in selectedVariety && (
                            <div className="flex">
                                <span className="w-36 font-medium text-[10px] text-emerald-800">Yield:</span>
                                <span className="text-gray-700 text-[10px]">{selectedVariety.yield}</span>
                            </div>
                        )}
                        {"plantHeight" in selectedVariety && (
                            <div className="flex">
                                <span className="w-36 text-[10px] font-medium text-emerald-800">Plant Height:</span>
                                <span className="text-gray-700 text-[10px]">{selectedVariety.plantHeight}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Varieties;