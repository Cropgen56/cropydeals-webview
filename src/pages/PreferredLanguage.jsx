import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const languageMap = {
  English: 'en',
  हिन्दी: 'hi',
  मराठी: 'mr',
  français: 'fr',
  ગુજરાતી: 'gu',
  বাংলা: 'bn',
  தமிழ்: 'ta',
  اردو: 'ur',
  Deutsch: 'de',
  Español: 'es',
};

const languages = [
  ['English', 'हिन्दी'],
  ['मराठी', 'français'],
  ['ગુજરાતી', 'বাংলা'],
  ['தமிழ்', 'اردو'],
  ['Deutsch', 'Español'],
];

const PreferredLanguage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // redirectTo from query params
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get('redirectTo') || '/';

  useEffect(() => {
    const lang = localStorage.getItem('language');
    if (lang) {
      const selected = Object.keys(languageMap).find(
        (key) => languageMap[key] === lang
      );
      setSelectedLanguage(selected);
      if (i18n && i18n.changeLanguage) i18n.changeLanguage(lang);
    }
  }, [i18n]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    const langCode = languageMap[language];
    localStorage.setItem('language', langCode);
    if (i18n && i18n.changeLanguage) i18n.changeLanguage(langCode);
  };

  const handleNext = () => {
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5FFFE] p-6">
      <h1 className="text-center text-2xl font-bold text-[#075A53] mb-10">
        {t('select_language_title')}
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {languages.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((language) => (
              <button
                key={language}
                className={`flex-1 py-6 rounded-lg border border-[#075A53] flex items-center justify-center transition-colors ease-in-out duration-300 cursor-pointer
                  ${selectedLanguage === language ? 'bg-[#075A53]' : 'bg-white'}`}
                onClick={() => handleLanguageSelect(language)}
              >
                <span
                  className={`font-medium text-lg ${
                    selectedLanguage === language
                      ? 'text-white font-bold'
                      : 'text-[#075A53]'
                  }`}
                >
                  {language}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedLanguage}
        className={`flex items-center justify-center gap-2 mt-10 px-6 py-3 rounded-lg transition-all duration-500 ease-in-out cursor-pointer
          ${selectedLanguage ? 'bg-[#075A53] text-white hover:bg-[#064639]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        <span className="font-bold">{t('next_button')}</span>
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default PreferredLanguage;
