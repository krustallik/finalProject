import 'react-native-gesture-handler';
import * as React from 'react';
import ThemeProvider from './src/theme/ThemeProvider';
import DrawerNavigator from './src/navigation/DrawerNavigator';

export default function App() {
    return (
        <ThemeProvider>
            <DrawerNavigator />
        </ThemeProvider>
    );
}
