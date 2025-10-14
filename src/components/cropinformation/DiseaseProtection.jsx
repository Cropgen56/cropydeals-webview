import React from 'react';

const DiseaseProtection = ({ diseases, selectedDisease, onDiseaseChange, controlMethod, onControlMethodChange }) => {
    return (
        <div className="space-y-4">
            {diseases?.length > 0 && (
                <div className="flex justify-end">
                    <select
                        value={selectedDisease?.disease || selectedDisease?.name || ""}
                        onChange={(e) => {
                            const disease = diseases.find((d) => (d.disease || d.name) === e.target.value);
                            onDiseaseChange(disease);
                        }}
                        className="border border-gray-300 rounded-md px-3 py-2 text-[10px]"
                    >
                        {diseases.map((d, i) => (
                            <option key={i} value={d.disease || d.name}>
                                {d.disease || d.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedDisease && (
                <div className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
                    <div className="flex flex-col items-start gap-4">
                        <div className="w-24 h-24 rounded-full border-2 border-emerald-800/50 flex items-center justify-center overflow-hidden">
                            <img
                                src={Array.isArray(selectedDisease.image) ? selectedDisease.image[0] : selectedDisease.image}
                                alt={selectedDisease.disease || selectedDisease.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="grid gap-2 mb-4">
                                <div>
                                    <p className="text-gray-500 text-[10px]">Disease Name:</p>
                                    <p className="font-medium text-[10px]">{selectedDisease.disease || selectedDisease.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px]">Symptoms:</p>
                                    <p className="font-medium text-[10px]">{selectedDisease.symptoms || selectedDisease.description}</p>
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="relative inline-block w-full">
                                    <select
                                        value={controlMethod}
                                        onChange={(e) => onControlMethodChange(e.target.value)}
                                        className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-green-500 text-[10px]"
                                    >
                                        <option value="organic">Organic Methods</option>
                                        <option value="inorganic">Inorganic Methods</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <p className="text-gray-500 text-[10px]">Preventive:</p>
                                    <p className="font-medium text-[10px]">
                                        {selectedDisease.controlMethods?.[controlMethod]?.preventive?.[0] || "No preventive methods available"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px]">Curative:</p>
                                    <p className="font-medium text-[10px]">
                                        {selectedDisease.controlMethods?.[controlMethod]?.curative?.[0] || "No curative methods available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiseaseProtection;