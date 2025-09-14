import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import CreateOffenseScreen from '../screens/CreateOffenseScreen';
import CalendarStack from "./CalendarStack";

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerTitleAlign: 'center',
                tabBarIcon: ({ focused, size }) => {
                    const color = focused ? colors.primary : colors.border;
                    let name = 'ellipse';
                    if (route.name === 'Календар') name = 'calendar-outline';
                    if (route.name === 'Карта')    name = 'map-outline';
                    if (route.name === 'Створити') name = 'add-circle-outline';
                    return <Ionicons name={name} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Календар"
                component={CalendarStack}
                options={{ headerShown: false, tabBarLabel: t('tabs.calendar') }}
            />
            <Tab.Screen
                name="Карта"
                component={MapScreen}
                options={{ headerShown: false, tabBarLabel: t('tabs.map') }}
            />
            <Tab.Screen
                name="Створити"
                component={CreateOffenseScreen}
                options={{ headerShown: false, tabBarLabel: t('tabs.create') }}
            />
        </Tab.Navigator>
    );
}
