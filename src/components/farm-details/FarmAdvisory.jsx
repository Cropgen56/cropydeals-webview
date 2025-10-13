import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react"; // for arrow icon

function FarmAdvisory() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [advisoryData, setAdvisoryData] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setAdvisoryData([
                    {
                        day: "Day 1",
                        disease_pest: "Monitor for early signs of fungal infection.",
                        spray: "Use recommended fungicide after rain.",
                        fertigation: "Apply nitrogen-based fertilizer.",
                        water: "Irrigate moderately in morning hours.",
                        monitoring: "Check leaf color and pest movement daily.",
                    },
                    {
                        day: "Day 2",
                        disease_pest: "Inspect crops for aphids.",
                        spray: "Apply neem-based spray if pest count increases.",
                        fertigation: "No fertigation today.",
                        water: "Reduce irrigation by 20%.",
                        monitoring: "Continue field observation every 4 hours.",
                    },
            ]);
        }, 800);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) =>
            prev < advisoryData.length - 1 ? prev + 1 : 0
        );
    };

    if (advisoryData.length === 0) {
        return (
            <div className="w-full bg-white rounded-lg border border-[#D9D9D9] p-4 shadow-sm animate-pulse flex flex-col gap-4">
                <div className="h-5 w-1/4 bg-gray-200 rounded mb-3"></div>
                <div className="h-24 bg-gray-100 rounded"></div>
            </div>
        );
    }

    const current = advisoryData[currentIndex];
    const keys = [
        "disease_pest",
        "spray",
        "fertigation",
        "water",
        "monitoring",
    ];

    return (
        <section className="w-full bg-white border border-[#D9D9D9] rounded-xl md:px-8 p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-base sm:text-xl font-bold text-[#075A53]">{current.day}</h2>
                <button
                    onClick={handleNext}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#075A5380] hover:bg-[#075A53] transition-all duration-500 ease-in-out cursor-pointer">
                    <ChevronRight className="text-white w-5 h-5" />
                </button>
            </div>

            <div className="border border-[#075A53] bg-[#F8F8F8] rounded-lg p-4">
                {keys.map((key) =>
                    current[key] ? (
                        <div key={key} className="mb-3">
                            <p className="text-[#075A53] text-sm font-bold capitalize">
                                {key.replace("_", " ")}
                            </p>
                            <p className="text-[#263238] text-sm leading-5">
                                {current[key]}
                            </p>
                        </div>
                    ) : null
                )}
            </div>
        </section>
    );
}

export default FarmAdvisory;

