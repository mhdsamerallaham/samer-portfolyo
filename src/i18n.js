import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

const resources = {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'tr', // default language is Turkish
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
