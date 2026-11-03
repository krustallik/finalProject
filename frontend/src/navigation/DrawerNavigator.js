import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Tabs from './Tabs';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawer from '../components/CustomDrawer';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { initDb } from '../db/database';
import { isOnline } from '../services/network';
import { syncPendingOffenses } from '../services/sync';
import { DEMO_MODE } from '../config/demo';

const Drawer = createDrawerNavigator();

/**
 * DrawerNavigator
 *
 * Основний Drawer-навігатор застосунку.
 * Містить вкладку "Додаток" (Tabs) і "Профіль".
 * При монтуванні ініціалізує локальну базу даних, виконує синхронізацію офлайн-записів.
 *
 * Behavior:
 * - initDb() виконується при старті
 * - кожну хвилину намагається синхронізувати офлайн-порушення, якщо є мережа
 */

export default function DrawerNavigator() {
    const { t } = useTranslation();

    React.useEffect(() => {
        (async () => {
            await initDb();
            const token = await AsyncStorage.getItem('token');
            const rawUser = await AsyncStorage.getItem('user');
            if (!token || !rawUser) return;
            const user = JSON.parse(rawUser);
            if (!DEMO_MODE && user?.id && await isOnline()) await syncPendingOffenses(user.id);
        })();

    }, []);

    return (
        <Drawer.Navigator
            // Кастомне меню Drawer
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{ headerTitleAlign: 'center' }}
        >
            <Drawer.Screen
                name="Додаток"
                component={Tabs}
                options={{ drawerLabel: t('drawer.app'), title: t('drawer.app') }}
            />
            <Drawer.Screen
                name="Профіль"
                component={ProfileScreen}
                options={{ drawerLabel: t('drawer.profile'), title: t('screens.profile') }}
            />
        </Drawer.Navigator>
    );
}
