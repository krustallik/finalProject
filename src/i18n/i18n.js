import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    uk: {
        translation: {
            tabs: { calendar: 'Календар', map: 'Карта', create: 'Створити' },
            drawer: { app: 'Додаток', profile: 'Профіль', themeDark: 'Темна тема', lang: 'Мова', logout: 'Вихід' },
            screens: { profile: 'Профіль', calendarTitle: 'Календар', mapTitle: 'Карта', createTitle: 'Створення правопорушення' }
        },
    },
    en: {
        translation: {
            tabs: { calendar: 'Calendar', map: 'Map', create: 'Create' },
            drawer: { app: 'App', profile: 'Profile', themeDark: 'Dark theme', lang: 'Language', logout: 'Logout' },
            screens: { profile: 'Profile', calendarTitle: 'Calendar', mapTitle: 'Map', createTitle: 'Create Offense' }
        },
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'uk',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
    });

export default i18n;
