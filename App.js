import 'react-native-gesture-handler';
import * as React from 'react';
import ThemeProvider from './src/theme/ThemeProvider';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import './src/i18n/i18n';
import LanguageProvider from './src/i18n/LanguageProvider';

export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <DrawerNavigator />
            </LanguageProvider>
        </ThemeProvider>
    );
}