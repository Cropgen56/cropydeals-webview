import React from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

const CropInfoStatic = () => {
    return (
        <div className="bg-[#F5F8F7] min-h-screen pb-16">
            {/* Header */}
            <div className="bg-emerald-800 text-white py-4 px-4 flex items-center">
                <ChevronLeft size={20} />
                <h1 className="text-lg font-semibold flex-1 text-center">Turnip</h1>
            </div>

            {/* Crop Image */}
            <div className="flex justify-center mt-5">
                <img
                    src="https://cropgen-assets.s3.ap-south-1.amazonaws.com/crops/1758540892495-turnip.jpg"
                    alt="Turnip"
                    className="w-28 h-28 rounded-full object-cover shadow-md"
                />
            </div>

            {/* General Info */}
            <div className="p-4">
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-1">
                        General Information
                    </h2>
                    <p className="text-gray-600 text-sm leading-snug">
                        Turnip (Brassicaceae) is a cool-weather crop grown for its roots and
                        vitamin-rich leaves (A, C, K, Calcium). Cultivated in temperate and
                        sub-tropical regions, with Bihar, Punjab, and Haryana as major
                        producers.
                    </p>
                </section>

                {/* Climate */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">Climate</h2>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="font-medium text-emerald-800">Temperature</p>
                            <p className="text-gray-600">12–30°C</p>
                        </div>
                        <div>
                            <p className="font-medium text-emerald-800">Sowing Temp.</p>
                            <p className="text-gray-600">18–23°C</p>
                        </div>
                        <div>
                            <p className="font-medium text-emerald-800">Rainfall</p>
                            <p className="text-gray-600">200–400cm</p>
                        </div>
                        <div>
                            <p className="font-medium text-emerald-800">Harvest Temp.</p>
                            <p className="text-gray-600">10–15°C</p>
                        </div>
                    </div>
                </section>

                {/* Soil Info */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-1">
                        Soil Information
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Prefers loamy soil rich in organic matter. Avoid heavy or very light
                        soils, which cause rough or malformed roots. Ideal pH 5.5–6.8.
                    </p>
                </section>

                {/* Popular Varieties */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">
                        Popular Varieties
                    </h2>
                    <div className="text-sm space-y-2">
                        <p>
                            <span className="font-medium text-emerald-800">Variety:</span> L1
                        </p>
                        <p>
                            <span className="font-medium text-emerald-800">Description:</span>{" "}
                            Ready in 45–60 days. Round, pure white, smooth roots with mild
                            flavour.
                        </p>
                        <p>
                            <span className="font-medium text-emerald-800">
                                Plant Height:
                            </span>{" "}
                            Short
                        </p>
                        <p>
                            <span className="font-medium text-emerald-800">Yield:</span> 105
                            qtl/acre
                        </p>
                    </div>
                </section>

                {/* Land Preparation */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-emerald-900 font-semibold">Land Preparation</h2>
                        <ChevronDown size={16} className="text-emerald-800" />
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                        Plough thoroughly to a fine, clod-free tilth. Add 60–80 qtl/acre of
                        well-decomposed cow dung. Avoid raw dung to prevent forked roots.
                    </p>
                </section>

                {/* Sowing */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-emerald-900 font-semibold">Sowing</h2>
                        <ChevronDown size={16} className="text-emerald-800" />
                    </div>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        <li>
                            <span className="font-medium text-emerald-800">
                                Time of Sowing:
                            </span>{" "}
                            Aug–Sept (Desi) / Oct–Nov (European)
                        </li>
                        <li>
                            <span className="font-medium text-emerald-800">Spacing:</span> 45
                            cm rows, 7.5 cm plants
                        </li>
                        <li>
                            <span className="font-medium text-emerald-800">
                                Sowing Depth:
                            </span>{" "}
                            1.5 cm
                        </li>
                    </ul>
                </section>

                {/* Seed Treatment */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">
                        Seed Treatment
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                        Treat seeds with Thiram to protect against crown rot.
                    </p>
                    <table className="w-full text-sm border border-gray-300 rounded-md">
                        <thead className="bg-gray-100 text-emerald-900 font-medium">
                            <tr>
                                <th className="px-2 py-1 text-left">Chemical</th>
                                <th className="px-2 py-1 text-left">Dosage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="px-2 py-1">Thiram (Contact Fungicide)</td>
                                <td className="px-2 py-1">3 gm/kg seed</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* Fertilizer */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">Fertilizer</h2>
                    <table className="w-full text-sm border border-gray-300 rounded-md mb-2">
                        <thead className="bg-gray-100 text-emerald-900 font-medium">
                            <tr>
                                <th className="px-2 py-1">Nitrogen</th>
                                <th className="px-2 py-1">Phosphorus</th>
                                <th className="px-2 py-1">Potash</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t text-gray-700">
                                <td className="px-2 py-1">25 kg/acre</td>
                                <td className="px-2 py-1">12 kg/acre</td>
                                <td className="px-2 py-1">As per soil test</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-sm text-gray-600">
                        Apply decomposed cow dung (60–80 qtl/acre). Apply full dose of Urea
                        and SSP at sowing.
                    </p>
                </section>

                {/* Pest Protection */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">
                        Pest Protection
                    </h2>
                    <div className="flex items-center gap-3">
                        <img
                            src="https://cropgen-assets.s3.ap-south-1.amazonaws.com/pests/1758540892495-turnip.jpg"
                            alt="Pest"
                            className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-emerald-800 text-sm">
                                Mustard Sawfly
                            </p>
                            <p className="text-xs text-gray-600">
                                Larvae chew large holes in leaves; severe attacks leave only the
                                midrib.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-gray-700 mt-2">
                        <p className="font-semibold text-emerald-800">Organic Methods:</p>
                        <p>
                            Preventive: Early sowing, dusting ash. Curative: Neem oil or hand
                            picking larvae.
                        </p>
                    </div>
                </section>

                {/* Disease Protection */}
                <section className="bg-white rounded-xl p-4 mb-3">
                    <h2 className="text-emerald-900 font-semibold mb-2">
                        Disease Protection
                    </h2>
                    <div className="flex items-center gap-3">
                        <img
                            src="https://cropgen-assets.s3.ap-south-1.amazonaws.com/diseases/1758540892495-turnip.jpg"
                            alt="Disease"
                            className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-medium text-emerald-800 text-sm">
                                Alternaria Leaf Spot
                            </p>
                            <p className="text-xs text-gray-600">
                                Small dark circular spots with concentric rings on leaves.
                            </p>
                        </div>
                    </div>
                    <div className="text-xs text-gray-700 mt-2">
                        <p className="font-semibold text-emerald-800">Organic Methods:</p>
                        <p>Preventive: Crop rotation. Curative: Copper fungicides.</p>
                    </div>
                </section>

                {/* Remaining Sections */}
                {[
                    { title: "Weed Control", text: "Thin plants 10–15 days after germination. Hoe and weed after 2–3 weeks to aerate soil." },
                    { title: "Irrigation", text: "Apply first irrigation after sowing. Repeat every 6–7 days in summer, 10–12 days in winter." },
                    { title: "Harvesting", text: "Harvest when roots reach 5–10 cm diameter (45–60 days). Store 8–15 days at 0–5°C, 90–95% RH." },
                    { title: "Post Harvesting", text: "For seed production, sow mid-Sept and transplant seedlings in early Dec. Harvest when 70% pods turn yellow." }
                ].map((sec, i) => (
                    <section key={i} className="bg-white rounded-xl p-4 mb-3">
                        <h2 className="text-emerald-900 font-semibold mb-1">{sec.title}</h2>
                        <p className="text-gray-600 text-sm">{sec.text}</p>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default CropInfoStatic;
