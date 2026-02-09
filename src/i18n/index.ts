import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Spanish locale imports
import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esServices from './locales/es/services.json';
import esProjects from './locales/es/projects.json';
import esAbout from './locales/es/about.json';
import esContact from './locales/es/contact.json';
import esChat from './locales/es/chat.json';
import esIntake from './locales/es/intake.json';
import esPrivacy from './locales/es/privacy.json';

// English locale imports
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enServices from './locales/en/services.json';
import enProjects from './locales/en/projects.json';
import enAbout from './locales/en/about.json';
import enContact from './locales/en/contact.json';
import enChat from './locales/en/chat.json';
import enIntake from './locales/en/intake.json';
import enPrivacy from './locales/en/privacy.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon,
        home: esHome,
        services: esServices,
        projects: esProjects,
        about: esAbout,
        contact: esContact,
        chat: esChat,
        intake: esIntake,
        privacy: esPrivacy,
      },
      en: {
        common: enCommon,
        home: enHome,
        services: enServices,
        projects: enProjects,
        about: enAbout,
        contact: enContact,
        chat: enChat,
        intake: enIntake,
        privacy: enPrivacy,
      },
    },
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'home', 'services', 'projects', 'about', 'contact', 'chat', 'intake', 'privacy'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'alexseis-lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
