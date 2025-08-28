import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

export const LangCtx = createContext({
    lang: 'uk',
    setLang: () => {},
});

const STORAGE_KEY = 'app.lang';

export default function LanguageProvider({ children }) {
    const [lang, setLangState] = useState('uk');

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'uk' || saved === 'en') {
                setLangState(saved);
                i18n.changeLanguage(saved);
            }
        })();
    }, []);

    const setLang = async (code) => {
        setLangState(code);
        i18n.changeLanguage(code);
        await AsyncStorage.setItem(STORAGE_KEY, code);
    };

    return (
        <LangCtx.Provider value={{ lang, setLang }}>
            {children}
        </LangCtx.Provider>
    );
}
