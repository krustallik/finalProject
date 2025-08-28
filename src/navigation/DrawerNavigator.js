import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Tabs from './Tabs';
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawer from '../components/CustomDrawer';
import { ThemeCtx } from '../theme/ThemeProvider';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const { navTheme } = React.useContext(ThemeCtx);

    return (
        <NavigationContainer theme={navTheme}>
            <Drawer.Navigator
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{ headerTitleAlign: 'center' }}
            >
                <Drawer.Screen name="Додаток" component={Tabs} />
                <Drawer.Screen name="Профіль" component={ProfileScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
