import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

/**
 * LangCtx
 *
 * Контекст для збереження поточної мови застосунку.
 * Значення за замовчуванням:
 * - lang: 'uk'
 * - setLang: функція-заглушка
 */
export const LangCtx = createContext({
    lang: 'uk',
    setLang: () => {},
});

const STORAGE_KEY = 'app.lang';

/**
 * LanguageProvider
 *
 * Провайдер, що зберігає і надає вибір мови у застосунку.
 * - При монтуванні: читає з AsyncStorage останню вибрану мову
 * - При зміні мови: оновлює стан, перемикає i18n та зберігає у AsyncStorage
 *
 * @param {React.ReactNode} children – внутрішні компоненти, які отримають доступ до LangCtx
 */
export default function LanguageProvider({ children }) {
    const [lang, setLangState] = useState('uk'); // стан вибраної мови (за замовчуванням – укр)

    // При першому запуску відновлюємо вибрану мову з AsyncStorage
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'uk' || saved === 'en') {
                setLangState(saved);
                await i18n.changeLanguage(saved);
            }
        })();
    }, []);

    // Метод зміни мови (оновлює state, i18n та зберігає у AsyncStorage)
    const setLang = async (code) => {
        setLangState(code);
        await i18n.changeLanguage(code);
        await AsyncStorage.setItem(STORAGE_KEY, code);
    };

    return (
        <LangCtx.Provider value={{ lang, setLang }}>
            {children}
        </LangCtx.Provider>
    );
}
