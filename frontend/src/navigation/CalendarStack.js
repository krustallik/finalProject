import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarScreen from '../screens/CalendarScreen';
import DayOffensesScreen from '../screens/DayOffensesScreen';

const Stack = createNativeStackNavigator();

export default function CalendarStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="CalendarMain"
                component={CalendarScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DayOffenses"
                component={DayOffensesScreen}
                options={{ title: 'Правопорушення за день' }}
            />
        </Stack.Navigator>
    );
}
