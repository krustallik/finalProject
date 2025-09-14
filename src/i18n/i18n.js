import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    uk: {
        translation: {
            tabs: { calendar: 'Календар', map: 'Карта', create: 'Створити' },
            drawer: { app: 'Додаток', profile: 'Профіль', themeDark: 'Темна тема', lang: 'Мова', logout: 'Вихід' },
            screens: { profile: 'Профіль', calendarTitle: 'Календар', mapTitle: 'Карта', createTitle: 'Створення правопорушення' },

            common: { delete: 'Видалити', save: 'Зберегти' },
            offense: {
                takePhoto: 'Зробити фото',
                changePhoto: 'Змінити фото',
                descriptionPlaceholder: 'Опис правопорушення *',
                categoryPlaceholder: 'Категорія (опц.)',
            },
            alerts: {
                cameraDeniedTitle: 'Немає доступу до камери',
                cameraDeniedMessage: 'Надай дозвіл у налаштуваннях.',
                descriptionRequiredTitle: 'Опис обовʼязковий',
                descriptionRequiredMessage: 'Вкажи короткий опис правопорушення.',
            },
            list: {
                empty: 'Немає локальних записів. Додай перший.',
            },
            auth: {
                loginTitle: 'Вхід',
                registerTitle: 'Реєстрація',
                namePlaceholder: "Ім'я",
                emailPlaceholder: 'Email',
                passwordPlaceholder: 'Пароль',
                loginBtn: 'Увійти',
                registerBtn: 'Зареєструватися',
                noAccount: 'Немає акаунту? Зареєструватися',
                haveAccount: 'Вже є акаунт? Увійти',
            },
        },
    },
    en: {
        translation: {
            tabs: { calendar: 'Calendar', map: 'Map', create: 'Create' },
            drawer: { app: 'App', profile: 'Profile', themeDark: 'Dark theme', lang: 'Language', logout: 'Logout' },
            screens: { profile: 'Profile', calendarTitle: 'Calendar', mapTitle: 'Map', createTitle: 'Create Offense' },

            common: { delete: 'Delete', save: 'Save' },
            offense: {
                takePhoto: 'Take Photo',
                changePhoto: 'Change photo',
                descriptionPlaceholder: 'Offense description *',
                categoryPlaceholder: 'Category (optional)',
            },
            alerts: {
                cameraDeniedTitle: 'Camera access denied',
                cameraDeniedMessage: 'Please allow camera access in settings.',
                descriptionRequiredTitle: 'Description is required',
                descriptionRequiredMessage: 'Please enter a short description of the offense.',
            },
            list: {
                empty: 'No local records yet. Add the first one.',
            },
            auth: {
                loginTitle: 'Login',
                registerTitle: 'Register',
                namePlaceholder: 'Name',
                emailPlaceholder: 'Email',
                passwordPlaceholder: 'Password',
                loginBtn: 'Sign In',
                registerBtn: 'Sign Up',
                noAccount: "Don't have an account? Sign up",
                haveAccount: 'Already have an account? Sign in',
            },

        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'uk',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18n;
