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

// Detect language from URL path at init time (before React hydration)
// so the first render is already in the correct language/direction.
function detectInitialLanguage() {
    if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/en/') || path === '/en') return 'en';
        if (path.startsWith('/ar/') || path === '/ar') return 'ar';
    }
    return 'tr';
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: detectInitialLanguage(),
        fallbackLng: 'tr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
