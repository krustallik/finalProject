import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import MapScreen from '../screens/MapScreen';
import CreateOffenseScreen from '../screens/CreateOffenseScreen';
import CalendarStack from "./CalendarStack";

const Tab = createBottomTabNavigator();

/**
 * Tabs
 *
 * Нижня панель навігації (BottomTabNavigator).
 * Складається з трьох вкладок:
 * - Календар (CalendarStack)
 * - Карта (MapScreen)
 * - Створити (CreateOffenseScreen)
 *
 * Особливості:
 * - Використовуються іконки Ionicons (залежно від route.name)
 */

export default function Tabs() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerTitleAlign: 'center',
                // Вибір іконки для вкладки
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
            {/* Вкладка календаря */}
            <Tab.Screen
                name="Календар"
                component={CalendarStack}
                options={{ headerShown: false, tabBarLabel: t('tabs.calendar') }}
            />

            {/* Вкладка карти */}
            <Tab.Screen
                name="Карта"
                component={MapScreen}
                options={{ headerShown: false, tabBarLabel: t('tabs.map') }}
            />

            {/* Вкладка створення порушення */}
            <Tab.Screen
                name="Створити"
                component={CreateOffenseScreen}
                options={{ headerShown: false, tabBarLabel: t('tabs.create') }}
            />
        </Tab.Navigator>
    );
}
