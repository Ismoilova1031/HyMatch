import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import uz from './locales/uz.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

i18n.use(initReactI18next).init({
  resources: {
    uz: { translation: uz },
    en: { translation: en },
    ja: { translation: ja },
  },
  lng: 'uz', // yoki 'en', 'ja' — boshlang‘ich til
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // React Native: Suspense ishlatmaymiz
  },
  returnNull: false,
});

export default i18n;