import React from 'react';

const Fertilizer = ({ fertilizer, nutrients, chemicals }) => {
    return (
        <div className="space-y-4">
            {/* Nutrient requirements */}
            {nutrients && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                    <p className="font-medium text-emerald-800 text-[10px] mb-2">
                        Nutrient Requirement (kg/acre)
                    </p>
                    <table className="w-full text-[10px] border-collapse text-center">
                        <thead>
                            <tr className="bg-white text-emerald-800">
                                <th className="px-2 py-1 border font-medium">Nitrogen</th>
                                <th className="px-2 py-1 border font-medium">Phosphorus</th>
                                <th className="px-2 py-1 border font-medium">Potash</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-2 py-2 border text-gray-700">
                                    {nutrients.nitrogen || "-"}
                                </td>
                                <td className="px-2 py-2 border text-gray-700">
                                    {nutrients.phosphorus || "-"}
                                </td>
                                <td className="px-2 py-2 border text-gray-700">
                                    {nutrients.potash || "-"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Fertilizer chemicals */}
            {chemicals?.length > 0 && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-[10px]">
                    <p className="font-medium text-emerald-800 text-[10px] mb-2">Fertilizers</p>
                    <table className="w-full text-[10px] border-collapse text-center">
                        <thead>
                            <tr className="bg-white text-emerald-800">
                                <th className="px-2 py-1 border font-medium">Name</th>
                                <th className="px-2 py-1 border font-medium">Dosage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chemicals.map((f, i) => (
                                <tr key={i}>
                                    <td className="px-2 py-2 border text-gray-700">{f.name}</td>
                                    <td className="px-2 py-2 border text-gray-700">{f.dosage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Application methods */}
            {fertilizer?.applicationMethods && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-[10px]">
                    <p className="font-medium text-emerald-800 text-[10px]">Application Methods</p>
                    <p className="text-gray-700 mt-1 text-[10px]">
                        {fertilizer.applicationMethods}
                    </p>
                </div>
            )}

            {/* Additional notes */}
            {fertilizer?.additionalNotes && (
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-[10px]">
                    <p className="font-medium text-emerald-800 text-[10px]">Notes</p>
                    <p className="text-gray-700 mt-1 text-[10px]">
                        {fertilizer.additionalNotes}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Fertilizer;