import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCrops } from '../redux/slices/cropSlice';
import { getMandiPrices } from '../redux/slices/mandiSlice';
import { SearchIcon } from "../assets/Icons";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const MandiRatesScreen = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // From crops slice
  const { crops, loading: cropsLoading, error: cropsError } = useSelector(state => state.crops);

  // From mandi slice
  const { mandiPrices, loading: mandiLoading, error: mandiError } = useSelector(state => state.mandi);

  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate = useNavigate();

  // Fetch crops on mount
  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  // Auto-select first crop when crops are loaded
  useEffect(() => {
    if (crops && crops.length > 0 && !selectedCrop) {
      handleCropSelect(crops[0]);
    }
  }, [crops]);

  // Handle crop selection
  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    const cropName = crop.name || crop.cropName || crop.title;
    dispatch(getMandiPrices({ cropName }));
  };

  // Refresh data
  const handleRefresh = () => {
    dispatch(fetchCrops());
    if (selectedCrop) {
      const cropName = selectedCrop.name || selectedCrop.cropName || selectedCrop.title;
      dispatch(getMandiPrices({ cropName }));
    }
  };

  // Loading & error states for crops
  if (cropsLoading && (!crops || crops.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loadingCrops")}</p>
        </div>
      </div>
    );
  }

  if (cropsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{t("Failed Load Crops")}</p>
          <button
            onClick={() => dispatch(fetchCrops())}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm ">
        <div className="container mx-auto px-4 py-3 flex items-center gap-25">
          <button
            onClick={() => { navigate("/") }}
            className="text-gray-800 p-1">←</button>
          <h1 className="text-xl font-bold text-gray-900">{t("Mandi Rate")}</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="relative flex justify-center">
          <input
            type="text"
            placeholder={t("Search Crop")}
            className="w-[300px] py-2 px-4 pl-11 rounded-full border-[2px] border-gray-300 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-transparent"
            disabled={cropsLoading}
          />
        </div>
      </div>

      {/* Crop Selection */}
      <div className="bg-white border-b top-[78px] z-10 ">
        <div className="container mx-auto px-4 py-6" >
          <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 no-scrollbar px-2 py-1 ">
            {crops.map(crop => {
              const isSelected = selectedCrop?._id === crop._id;
              return (
                <button
                  key={crop._id}
                  onClick={() => handleCropSelect(crop)}
                  className="flex-shrink-0 flex flex-col items-center gap-1"
                >
                  <div className={`relative w-20 h-20 rounded-full shadow-md overflow-hidden ${isSelected ? 'ring-2 ring-[#458A84]/50' : ''}`}>
                    <img
                      src={crop.cropImage}
                      alt={crop.name || crop.cropName}
                      className="w-full h-full object-cover"
                      onError={e => (e.target.src = 'https://via.placeholder.com/80')}
                    />
                  </div>
                  <span className={`text-xs font-medium text-center ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                    {crop.name || crop.cropName || crop.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mandi Prices List */}
      <div className="container mx-auto px-4 py-2 h-screen overflow-y-auto">
        {mandiLoading.mandiPrices ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t("Fetching MandiPrices")}</p>
            </div>
          </div>
        ) : mandiError ? (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">{t("failedLoadMandiPrices")}</p>
            <button
              onClick={() => selectedCrop && dispatch(getMandiPrices({ cropName: selectedCrop.name || selectedCrop.cropName }))}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t("retry")}
            </button>
          </div>
        ) : mandiPrices && mandiPrices.length > 0 ? (
          <div className="space-y-3 pb-6">
            {mandiPrices.map((item, idx) => {
              const cropName = selectedCrop?.name || selectedCrop?.cropName || selectedCrop?.title;
              const modalPrice = item.modal_price || '0';
              const maxPrice = item.max_price || '0';
              const minPrice = item.min_price || '0';
              const date = item.arrival_date || 'N/A';

              return (
                <div
                  key={`KATEX_INLINE_OPEN{item.market}-KATEX_INLINE_CLOSE{item.district}-${idx}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={selectedCrop?.cropImage}
                        alt={cropName}
                        className="w-full h-full object-cover"
                        onError={e => (e.target.src = 'https://via.placeholder.com/48')}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#075A53] text-lg">{cropName}</h3>
                      <p className="text-[12px] text-gray-500">
                        {item.district || 'N/A'} . {item.market || 'N/A'}
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">{date}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 text-[10px] text-green-600">
                        <span>↑</span>
                        <span>{t("maxPrice")}</span>
                        <span>₹{maxPrice}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-red-600 mt-1">
                        <span>↓</span>
                        <span>{t("minPrice")}</span>
                        <span>₹{minPrice}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 font-bold text-gray-800 text-[10px]">
                      <span>₹{modalPrice}</span>
                      <span className="text-[10px] text-gray-500">{t("perQuintal")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">{t("noMandiPrices")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MandiRatesScreen;
