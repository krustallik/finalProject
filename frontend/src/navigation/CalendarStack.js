import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/CalendarScreen';
import DayOffensesScreen from '../screens/DayOffensesScreen';

const Stack = createNativeStackNavigator();

/**
 * CalendarStack
 *
 * Стек-навігатор для вкладки "Календар".
 * Містить:
 * - CalendarMain: головний екран з календарем (без заголовка)
 * - DayOffenses: список правопорушень за конкретну дату
 */

export default function CalendarStack() {
    return (
        <Stack.Navigator>
            {/* Головний календар */}
            <Stack.Screen
                name="CalendarMain"
                component={CalendarScreen}
                options={{ headerShown: false }}
            />

            {/* Деталізація: правопорушення за день */}
            <Stack.Screen
                name="DayOffenses"
                component={DayOffensesScreen}
                options={{ title: 'Правопорушення за день' }}
            />
        </Stack.Navigator>
    );
}
