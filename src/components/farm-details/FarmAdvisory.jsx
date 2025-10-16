// import React, { useState, useEffect } from "react";
// import { ChevronRight } from "lucide-react"; // for arrow icon

// function FarmAdvisory({farm}) {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [advisoryData, setAdvisoryData] = useState([]);

//     useEffect(() => {
//         setTimeout(() => {
//             setAdvisoryData([
//                     {
//                         day: "Day 1",
//                         disease_pest: "Monitor for early signs of fungal infection.",
//                         spray: "Use recommended fungicide after rain.",
//                         fertigation: "Apply nitrogen-based fertilizer.",
//                         water: "Irrigate moderately in morning hours.",
//                         monitoring: "Check leaf color and pest movement daily.",
//                     },
//                     {
//                         day: "Day 2",
//                         disease_pest: "Inspect crops for aphids.",
//                         spray: "Apply neem-based spray if pest count increases.",
//                         fertigation: "No fertigation today.",
//                         water: "Reduce irrigation by 20%.",
//                         monitoring: "Continue field observation every 4 hours.",
//                     },
//             ]);
//         }, 800);
//     }, []);

//     const handleNext = () => {
//         setCurrentIndex((prev) =>
//             prev < advisoryData.length - 1 ? prev + 1 : 0
//         );
//     };

//     if (advisoryData.length === 0) {
//         return (
//             <div className="w-full bg-white rounded-lg border border-[#D9D9D9] p-4 shadow-sm animate-pulse flex flex-col gap-4">
//                 <div className="h-5 w-1/4 bg-gray-200 rounded mb-3"></div>
//                 <div className="h-24 bg-gray-100 rounded"></div>
//             </div>
//         );
//     }

//     const current = advisoryData[currentIndex];
//     const keys = [
//         "disease_pest",
//         "spray",
//         "fertigation",
//         "water",
//         "monitoring",
//     ];

//     return (
//         <section className="w-full bg-white border border-[#D9D9D9] rounded-xl md:px-8 p-4 flex flex-col gap-4">
//             <div className="flex justify-between items-center">
//                 <h2 className="text-base sm:text-xl font-bold text-[#075A53]">{current.day}</h2>
//                 <button
//                     onClick={handleNext}
//                     className="w-8 h-8 flex items-center justify-center rounded-full bg-[#075A5380] hover:bg-[#075A53] transition-all duration-500 ease-in-out cursor-pointer">
//                     <ChevronRight className="text-white w-5 h-5" />
//                 </button>
//             </div>

//             <div className="border border-[#075A53] bg-[#F8F8F8] rounded-lg p-4">
//                 {keys.map((key) =>
//                     current[key] ? (
//                         <div key={key} className="mb-3">
//                             <p className="text-[#075A53] text-sm font-bold capitalize">
//                                 {key.replace("_", " ")}
//                             </p>
//                             <p className="text-[#263238] text-sm leading-5">
//                                 {current[key]}
//                             </p>
//                         </div>
//                     ) : null
//                 )}
//             </div>
//         </section>
//     );
// }

// export default FarmAdvisory;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetAdvisory, generateAdvisory } from "../../redux/slices/satelliteSlice";

function FarmAdvisory({ farm, SoilMoisture }) {
  const [language, setLanguage] = useState("en");
  const [isLanguageLoading, setIsLanguageLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dispatch = useDispatch();
  const { Advisory, cropGrowthStage, isLoading } = useSelector(state => state.satellite);
  const { forecastData } = useSelector(state => state.weather);

  const bbchStage = cropGrowthStage?.finalStage?.bbch;
  const currentWeather = forecastData?.current;

  // Load language from localStorage
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem("language") || "en";
      setLanguage(storedLang);
      if (!storedLang) localStorage.setItem("language", "en");
    } catch {
      setLanguage("en");
    } finally {
      setIsLanguageLoading(false);
    }
  }, []);

  // Dispatch advisory API when farm, weather, language are ready
  useEffect(() => {
  if (!farm?._id || !forecastData?.current || !language) return;

  setCurrentIndex(0);

  dispatch(
    generateAdvisory({
      farmDetails: farm,
      currentWeather: forecastData.current,
      SoilMoisture: SoilMoisture || {},
      bbchStage,
      language,
    })
  );
}, [farm, forecastData, language, SoilMoisture, bbchStage, dispatch]);


  // Key mapping
  const keyMap = {
    // English
    'Disease Pest': 'disease_pest',
    Spray: 'spray',
    Fertigation: 'fertigation',
    Water: 'water',
    Monitoring: 'monitoring',
    // Hindi
    'रोग और कीट': 'disease_pest',
    छिड़काव: 'spray',
    'उर्वरक सिंचाई': 'fertigation',
    पानी: 'water',
    निगरानी: 'monitoring',
    // Marathi
    'रोग कीटक': 'disease_pest',
    फवारणी: 'spray',
    फर्टिगेशन: 'fertigation',
    पाणी: 'water',
    निरीक्षण: 'monitoring',
    // French
    'Maladie et ravageurs': 'disease_pest',
    Pulvérisation: 'spray',
    Fertigation: 'fertigation', // Often same as English
    Eau: 'water',
    Surveillance: 'monitoring',
    // Gujarati
    'રોગ અને જીવાત': 'disease_pest',
    છંટકાવ: 'spray',
    ફર્ટિગેશન: 'fertigation',
    પાણી: 'water',
    નિરીક્ષણ: 'monitoring',
    // Bengali
    'রোগ ও পোকা': 'disease_pest',
    স্প্রে: 'spray',
    ফার্টিগেশন: 'fertigation',
    জল: 'water',
    পর্যবেক্ষণ: 'monitoring',
    // Tamil
    'நோய் மற்றும் பூச்சி': 'disease_pest',
    தெளிப்பு: 'spray',
    ஃபர்டிகேஷன்: 'fertigation',
    தண்ணீர்: 'water',
    கண்காணிப்பு: 'monitoring',
    // Urdu
    'بیماری اور کیڑے': 'disease_pest',
    اسپرے: 'spray',
    فرٹیگیشن: 'fertigation',
    پانی: 'water',
    نگرانی: 'monitoring',
    // German
    'Krankheit und Schädlinge': 'disease_pest',
    Sprühen: 'spray',
    Fertigation: 'fertigation', // Often same as English
    Wasser: 'water',
    Überwachung: 'monitoring',
    // Spanish
    'Enfermedad y plagas': 'disease_pest',
    Rociar: 'spray',
    Fertirrigación: 'fertigation',
    Agua: 'water',
    Monitoreo: 'monitoring',
  };

  // Parse advisory text
  const advisoryArray = useMemo(() => {
    if (!Advisory?.advisory) return [];

    const dayBlocks = Advisory.advisory
      .trim()
      .split(/\n\s*\n/)
      .filter(day =>
        day.trim().match(/^(?:\*\*)?(DAY|दिवस|Jour|દિવસ|দিন|நாள்|دن|Tag|Día)\s*\d+/i)
      );

    return dayBlocks.map(dayText => {
      const lines = dayText.split("\n").filter(line => line.trim());
      const dayMatch = lines[0].match(
        /(?:\*\*)?(?:DAY|दिवस|Jour|દિવસ|দিন|நாள்|دن|Tag|Día)\s*(\d+)/i
      );
      const day = dayMatch ? `Day ${dayMatch[1]}` : "Unknown Day";
      const dayData = { day };

      lines.slice(1).forEach(line => {
        const [key, ...value] = line.split(" - ");
        if (key && value.length > 0) {
          const cleanedValue = value.join(" - ").trim().replace(/\[|\]/g, "").trim();
          const mappedKey = keyMap[key.trim()] || key.trim().toLowerCase().replace(/\s+/g, "_");
          dayData[mappedKey] = cleanedValue;
        }
      });

      return dayData;
    });
  }, [Advisory?.advisory]);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => (i < advisoryArray.length - 1 ? i + 1 : 0));
  }, [advisoryArray.length]);

  // Show loading if API is in progress or language is loading
  const loading = isLanguageLoading || isLoading?.Advisory;
  if (loading) return <p>Loading advisory...</p>;

  // Show message if advisory is empty
  if (advisoryArray.length === 0) return <p>No advisory available</p>;

  const current = advisoryArray[currentIndex];
  const keys = ["disease_pest", "spray", "fertigation", "water", "monitoring"];

  return (
    <section className="w-full bg-white border border-[#D9D9D9] rounded-xl md:px-8 p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base sm:text-xl font-bold text-[#075A53]">{current.day}</h2>
        <button
          onClick={handleNext}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#075A5380] hover:bg-[#075A53] transition-all duration-500 ease-in-out cursor-pointer"
        >
          <ChevronRight className="text-white w-5 h-5" />
        </button>
      </div>

      <div className="border border-[#075A53] bg-[#F8F8F8] rounded-lg p-4">
        {keys.map(key =>
          current[key] ? (
            <div key={key} className="mb-3">
              <p className="text-[#075A53] text-sm font-bold capitalize">{key.replace("_", " ")}</p>
              <p className="text-[#263238] text-sm leading-5">{current[key]}</p>
            </div>
          ) : null
        )}
      </div>

      <div className="flex justify-center gap-2 mt-2">
        {advisoryArray.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-[#075A53]" : "bg-[#D9D9D9]"}`}
          />
        ))}
      </div>
    </section>
  );
}

export default FarmAdvisory;
