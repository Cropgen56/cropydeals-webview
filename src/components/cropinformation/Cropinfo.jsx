import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCropById } from "../../redux/slices/cropSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from './Header';
import CropImage from './CropImage';
import SectionWrapper from './SectionWrapper';
import GeneralInfo from './GeneralInfo';
import Climate from './Climate';
import Soil from './Soil';
import LandPreparation from './LandPreparation';
import Varieties from './Varieties';
import Nursery from './Nursery';
import Seed from './Seed';
import Sowing from './Sowing';
import Fertilizer from './Fertilizer';
import WeedControl from './WeedControl';
import Irrigation from './Irrigation';
import PestProtection from './PestProtection';
import DiseaseProtection from './DiseaseProtection';
import Harvesting from './Harvesting';
import PostHarvesting from './PostHarvesting';
import Loading from "../common/Loader";

const CropInfoDynamic = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedCrop, loading, error } = useSelector((state) => state.crops);

    const [openSections, setOpenSections] = useState({});
    const [expanded, setExpanded] = useState({});
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [selectedPest, setSelectedPest] = useState(null);
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [pestControlMethod, setPestControlMethod] = useState('organic');
    const [diseaseControlMethod, setDiseaseControlMethod] = useState('organic');
    const navigate = useNavigate();

    useEffect(() => {
        if (id) dispatch(fetchCropById(id));
    }, [dispatch, id]);

    // Normalize data
    const crop = selectedCrop || {};
    const pests = useMemo(() => crop.pests || crop.pestProtection || [], [crop]);
    const diseases = useMemo(() => crop.diseases || crop.diseaseProtection || [], [crop]);
    const fertChemicals = useMemo(
        () => crop.fertilizer?.chemicals || crop.fertilizer?.fertilizers || [],
        [crop]
    );
    const nutrients = crop.fertilizer?.nutrients || null;
    const seedData = crop.seed || {};
    const seedTreatment = crop.seedTreatment || seedData.seedTreatment || null;

    useEffect(() => {
        if (!selectedCrop) return;

        setSelectedVariety(selectedCrop.variety?.[0] || null);
        setSelectedPest((pests && pests[0]) || null);
        setSelectedDisease((diseases && diseases[0]) || null);

        const keys = [
            "generalInfo", "climate", "soil", "landPreparation", "varieties",
            "nursery", "seed", "sowing", "fertilizer", "weedControl",
            "irrigation", "pestProtection", "diseaseProtection", "harvesting", "postHarvesting"
        ];
        setOpenSections(Object.fromEntries(keys.map((k) => [k, true])));
    }, [selectedCrop, pests, diseases]);

    const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    const toggleExpand = (key) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

    if (loading) return <Loading/>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!selectedCrop) return <p className="p-4">No data found.</p>;

    const sections = [
        {
            key: 'generalInfo',
            title: 'General Information',
            component: crop.generalInfo && (
                <GeneralInfo
                    generalInfo={crop.generalInfo}
                    expanded={expanded.generalInfo}
                    onToggleExpand={() => toggleExpand('generalInfo')}
                />
            )
        },
        {
            key: 'climate',
            title: 'Climate',
            component: crop.climate && <Climate climate={crop.climate} />
        },
        {
            key: 'soil',
            title: 'Soil Information',
            component: crop.soil && (
                <Soil
                    soil={crop.soil}
                    expanded={expanded.soil}
                    onToggleExpand={() => toggleExpand('soil')}
                />
            )
        },
        {
            key: 'landPreparation',
            title: 'Land Preparation',
            component: crop.landPreparation && (
                <LandPreparation
                    landPreparation={crop.landPreparation}
                    expanded={expanded.landPreparation}
                    onToggleExpand={() => toggleExpand('landPreparation')}
                />
            )
        },
        {
            key: 'varieties',
            title: 'Popular Varieties',
            component: crop.variety && (
                <Varieties
                    varieties={crop.variety}
                    selectedVariety={selectedVariety}
                    onVarietyChange={setSelectedVariety}
                />
            )
        },
        {
            key: 'nursery',
            title: 'Nursery Management',
            component: crop.nursery && <Nursery nursery={crop.nursery} />
        },
        {
            key: 'seed',
            title: 'Seed',
            component: (seedData || seedTreatment) && (
                <Seed seedData={seedData} seedTreatment={seedTreatment} />
            )
        },
        {
            key: 'sowing',
            title: 'Sowing',
            component: crop.sowing && <Sowing sowing={crop.sowing} />
        },
        {
            key: 'fertilizer',
            title: 'Fertilizers',
            component: (nutrients || fertChemicals?.length > 0 || crop.fertilizer) && (
                <Fertilizer
                    fertilizer={crop.fertilizer}
                    nutrients={nutrients}
                    chemicals={fertChemicals}
                />
            )
        },
        {
            key: 'weedControl',
            title: 'Weed Control',
            component: crop.weedControl && (
                <WeedControl
                    weedControl={crop.weedControl}
                    expanded={expanded.weedControl}
                    onToggleExpand={() => toggleExpand('weedControl')}
                />
            )
        },
        {
            key: 'irrigation',
            title: 'Irrigation',
            component: crop.irrigation && (
                <Irrigation
                    irrigation={crop.irrigation}
                    expanded={expanded.irrigation}
                    onToggleExpand={() => toggleExpand('irrigation')}
                />
            )
        },
        {
            key: 'pestProtection',
            title: 'Pest Protection',
            component: pests.length > 0 && (
                <PestProtection
                    pests={pests}
                    selectedPest={selectedPest}
                    onPestChange={(pest) => {
                        setSelectedPest(pest);
                        setPestControlMethod('organic');
                    }}
                    controlMethod={pestControlMethod}
                    onControlMethodChange={setPestControlMethod}
                />
            )
        },
        {
            key: 'diseaseProtection',
            title: 'Disease Protection',
            component: diseases.length > 0 && (
                <DiseaseProtection
                    diseases={diseases}
                    selectedDisease={selectedDisease}
                    onDiseaseChange={(disease) => {
                        setSelectedDisease(disease);
                        setDiseaseControlMethod('organic');
                    }}
                    controlMethod={diseaseControlMethod}
                    onControlMethodChange={setDiseaseControlMethod}
                />
            )
        },
        {
            key: 'harvesting',
            title: 'Harvesting',
            component: crop.harvesting && (
                <Harvesting
                    harvesting={crop.harvesting}
                    expanded={expanded.harvesting}
                    onToggleExpand={() => toggleExpand('harvesting')}
                />
            )
        },
        {
            key: 'postHarvesting',
            title: 'Post Harvesting',
            component: crop.postHarvesting && (
                <PostHarvesting
                    postHarvesting={crop.postHarvesting}
                    expanded={expanded.postHarvesting}
                    onToggleExpand={() => toggleExpand('postHarvesting')}
                />
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F8F7] pb-16">

            <div className="bg-[#00695C] text-white text-center py-6 relative h-[100px] mb-4">

                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-white hover:text-gray-200 transition"
                >
                    <ArrowLeft size={22} />
                </button>

                <h1 className="text-2xl font-semibold">{crop.cropName}</h1>

                <div
                    className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/6 w-24 h-24 rounded-full overflow-hidden
          border-2 border-emerald-800/50 bg-white"
                >
                    <img
                        src={crop.cropImage}
                        alt={crop.cropName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <div className="pt-16 px-4 space-y-3">
                {sections.map(({ key, title, component }) =>
                    component && (
                        <SectionWrapper
                            key={key}
                            title={title}
                            isOpen={openSections[key]}
                            onToggle={() => toggleSection(key)}
                        >
                            {component}
                        </SectionWrapper>
                    )
                )}
            </div>
        </div>

    );
};

export default CropInfoDynamic;