import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavDark, DefaultTheme as NavLight } from '@react-navigation/native';

/**
 * ThemeCtx
 *
 * Контекст для керування темою (light/dark).
 * Значення:
 * - themeName: 'light' | 'dark'
 * - navTheme: об'єкт теми для react-navigation
 * - toggleTheme: перемикає тему та зберігає у AsyncStorage
 */
export const ThemeCtx = createContext({
    themeName: 'light',
    navTheme: NavLight,
    toggleTheme: () => {},
});

const STORAGE_KEY = 'app.theme';

/**
 * ThemeProvider
 *
 * Провайдер, який керує станом теми застосунку:
 * - завантажує попередній вибір із AsyncStorage
 * - зберігає новий вибір після toggleTheme
 * - передає у контекст themeName, navTheme і toggleTheme
 */

export default function ThemeProvider({ children }) {
    const [themeName, setThemeName] = useState('light');

    // завантаження теми при старті
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'dark' || saved === 'light') {
                setThemeName(saved);
            }
        })();
    }, []);

    // тема для навігації
    const navTheme = themeName === 'dark' ? NavDark : NavLight;

    // перемикання теми з оновленням у AsyncStorage
    const toggleTheme = async () => {
        const next = themeName === 'light' ? 'dark' : 'light';
        setThemeName(next);
        await AsyncStorage.setItem(STORAGE_KEY, next);
    };

    return (
        <ThemeCtx.Provider value={{ themeName, navTheme, toggleTheme }}>
            {children}
        </ThemeCtx.Provider>
    );
}
