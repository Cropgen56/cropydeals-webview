import React from 'react';

const Seed = ({ seedData, seedTreatment }) => {
    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-[10px]">
                <div className="flex">
                    <span className="w-36 text-[10px] font-medium text-emerald-800">Seed Rate:</span>
                    <span className="text-gray-700 text-[10px]">{seedData?.seedRate || "-"}</span>
                </div>
                {seedTreatment?.method && (
                    <div className="mt-2">
                        <span className="font-medium text-emerald-800 text-[10px]">Seed Treatment:</span>
                        <p className="text-gray-700 mt-1 text-[10px]">{seedTreatment.method}</p>
                    </div>
                )}
            </div>

            {seedTreatment?.chemicals?.length > 0 && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-[10px]">
                    <p className="font-medium text-emerald-800 text-[10px] mb-2">
                        Seed Treatment Chemicals
                    </p>
                    <table className="w-full text-[10px] border-collapse text-center">
                        <thead>
                            <tr className="bg-white text-emerald-800">
                                <th className="px-2 py-2 border font-medium">Chemical</th>
                                <th className="px-2 py-2 border font-medium">Dosage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seedTreatment.chemicals.map((c, i) => (
                                <tr key={i} className="border-t">
                                    <td className="px-2 py-2 border text-gray-700">{c.name}</td>
                                    <td className="px-2 py-2 border text-gray-700">{c.dosage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Seed;