import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ThemeProvider, { ThemeCtx } from './src/theme/ThemeProvider';
import LanguageProvider from './src/i18n/LanguageProvider';
import './src/i18n/i18n';

import DrawerNavigator from './src/navigation/DrawerNavigator';
import AuthScreen from './src/screens/AuthScreen';

const Stack = createNativeStackNavigator();

/**
 * App
 *
 * Головний компонент програми.
 * Обгортає все у ThemeProvider та LanguageProvider.
 * Використовує NavigationContainer для керування стеком.
 *
 * Stack:
 * - Main: DrawerNavigator
 * - Auth: екран автентифікації
 */


export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <WithThemeNavigation />
            </LanguageProvider>
        </ThemeProvider>
    );
}

/**
 * WithThemeNavigation
 *
 * Допоміжний компонент, що читає тему з ThemeCtx
 * і підключає її до NavigationContainer.
 */
function WithThemeNavigation() {
    const { navTheme } = React.useContext(ThemeCtx);

    return (
        <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
                <Stack.Screen name="Main" component={DrawerNavigator} />
                <Stack.Screen name="Auth" component={AuthScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
