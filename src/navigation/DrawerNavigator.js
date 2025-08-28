import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Tabs from './Tabs';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawer from '../components/CustomDrawer';
import { ThemeCtx } from '../theme/ThemeProvider';
import {useTranslation} from "react-i18next";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { navTheme } = React.useContext(ThemeCtx);
    const { t } = useTranslation();

    return (
        <NavigationContainer theme={navTheme}>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{ headerTitleAlign: 'center' }}
            >
                <Drawer.Screen
                    name="Додаток"
                    component={Tabs}
                    options={{ drawerLabel: t('drawer.app'),title: t('drawer.app') }}
                />
                <Drawer.Screen
                    name="Профіль"
                    component={ProfileScreen}
                    options={{ drawerLabel: t('drawer.profile'), title: t('screens.profile') }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
