import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    uk: {
        translation: {
            tabs: { calendar: 'Календар', map: 'Карта', create: 'Створити' },
            drawer: { app: 'Додаток', profile: 'Профіль', themeDark: 'Темна тема', lang: 'Мова', logout: 'Вихід' },
            screens: { profile: 'Профіль', calendarTitle: 'Календар', mapTitle: 'Карта', createTitle: 'Створення правопорушення' },
            byUser: 'Автор: {{user}}',
            common: { delete: 'Видалити', save: 'Зберегти', cancel: 'Відмінити' },
            offense: {
                takePhoto: 'Зробити фото',
                changePhoto: 'Змінити фото',
                descriptionPlaceholder: 'Опис правопорушення *',
                categoryPlaceholder: 'Категорія (опц.)',
                descriptionLabel: 'Опис',
    categoryLabel: 'Категорія',
     selectCategory: 'Оберіть категорію',
     categories: {
       traffic: 'ДТП / Дорожнє',
           vandalism: 'Вандалізм',
           theft: 'Крадіжка',
           noise: 'Шум/Порядок',
           parking: 'Паркування',
           other: 'Інше',
         },
            },
            alerts: {
                cameraDeniedTitle: 'Немає доступу до камери',
                cameraDeniedMessage: 'Надай дозвіл у налаштуваннях.',
                descriptionRequiredTitle: 'Опис обовʼязковий',
                descriptionRequiredMessage: 'Вкажи короткий опис правопорушення.',
                authRequiredTitle: 'Потрібна авторизація',
                authRequiredMessage: 'Увійдіть у свій акаунт, щоб створити правопорушення.',
            },
            list: { empty: 'Немає локальних записів. Додай перший.' },

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
                logoutBtn: 'Вийти',
                welcome: 'Ласкаво просимо!',
                guestLogin : 'Увійти як гість',
            },

            calendar: {
                today: 'Сьогодні',
                weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
                monthYear: '{{month}} {{year}} р.',
                category : "Категорія",
            },

            tasks: {
                headerOnDate: 'Задачі на {{date}}',
                newPlaceholder: 'Нова задача...',
                empty: 'Немає задач',
            },

        },
    },
    en: {
        translation: {
            tabs: { calendar: 'Calendar', map: 'Map', create: 'Create' },
            drawer: { app: 'App', profile: 'Profile', themeDark: 'Dark theme', lang: 'Language', logout: 'Logout' },
            screens: { profile: 'Profile', calendarTitle: 'Calendar', mapTitle: 'Map', createTitle: 'Create Offense' },
            byUser: 'By: {{user}}',
            common: { delete: 'Delete', save: 'Save', cancel: 'Cancel' },
            offense: {
                takePhoto: 'Take Photo',
                changePhoto: 'Change photo',
                descriptionPlaceholder: 'Offense description *',
                categoryPlaceholder: 'Category (optional)',
                 descriptionLabel: 'Description',
     categoryLabel: 'Category',
     selectCategory: 'Select a category',
     categories: {
       traffic: 'Traffic/Road',
           vandalism: 'Vandalism',
           theft: 'Theft',
           noise: 'Noise/Order',
           parking: 'Parking',
           other: 'Other',
         },
            },
            alerts: {
                cameraDeniedTitle: 'Camera access denied',
                cameraDeniedMessage: 'Please allow camera access in settings.',
                descriptionRequiredTitle: 'Description is required',
                descriptionRequiredMessage: 'Please enter a short description of the offense.',
                authRequiredTitle: "Authorization required",
                authRequiredMessage: "Please log in to your account to create an offense.",
            },
            list: { empty: 'No local records yet. Add the first one.' },

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
                logoutBtn: 'Log Out',
                welcome: 'Welcome!',
                guestLogin: "Continue as Guest"
            },

            calendar: {
                today: 'Today',
                weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                monthYear: '{{month}} {{year}}',
                category : "Category",
            },

            tasks: {
                headerOnDate: 'Tasks for {{date}}',
                newPlaceholder: 'New task...',
                empty: 'No tasks',
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
