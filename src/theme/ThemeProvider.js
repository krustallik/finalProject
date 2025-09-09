import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme as NavDark, DefaultTheme as NavLight } from '@react-navigation/native';

export const ThemeCtx = createContext({
    themeName: 'light',
    navTheme: NavLight,
    toggleTheme: () => {},
});

const STORAGE_KEY = 'app.theme';

export default function ThemeProvider({ children }) {
    const [themeName, setThemeName] = useState('light');

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'dark' || saved === 'light') {
                setThemeName(saved);
            }
        })();
    }, []);

    const navTheme = themeName === 'dark' ? NavDark : NavLight;

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
