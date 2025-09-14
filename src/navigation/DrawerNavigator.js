import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Tabs from './Tabs';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawer from '../components/CustomDrawer';
import { useTranslation } from 'react-i18next';

import { initDb } from '../db/database';
import { isOnline } from '../services/network';
import { syncPendingOffenses } from '../services/sync';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { t } = useTranslation();

    React.useEffect(() => {
        (async () => {
            await initDb();
            if (await isOnline()) await syncPendingOffenses();
        })();

        const timer = setInterval(async () => {
            if (await isOnline()) {
                console.log('⏰ Автосинк…');
                await syncPendingOffenses();
            }
        }, 60_000);

        return () => clearInterval(timer);
    }, []);

    return (
        <Drawer.Navigator
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
