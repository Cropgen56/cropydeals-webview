import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '../translation/locales/en.json';
import hi from '../translation/locales/hi.json';
import mr from '../translation/locales/mr.json';
import fr from '../translation/locales/fr.json';
import gu from '../translation/locales/gu.json';
import bn from '../translation/locales/bn.json';
import ta from '../translation/locales/ta.json';
import ur from '../translation/locales/ur.json';
import de from '../translation/locales/de.json';
import es from '../translation/locales/es.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  fr: { translation: fr },
  gu: { translation: gu },
  bn: { translation: bn },
  ta: { translation: ta },
  ur: { translation: ur },
  de: { translation: de },
  es: { translation: es },
};

// Load language from localStorage (synchronously for web)
const lng = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
