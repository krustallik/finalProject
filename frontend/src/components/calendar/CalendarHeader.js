import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function CalendarHeader({ month, year, onPrev, onNext, onToday }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    return (
        <View style={s.headerBar}>
            <Text style={s.monthText}>{t('calendar.monthYear', { month, year })}</Text>

            <View style={s.nav}>
                <TouchableOpacity style={s.arrowButton} onPress={onPrev}>
                    <Ionicons name="arrow-up-outline" size={17} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={s.arrowButton} onPress={onNext}>
                    <Ionicons name="arrow-down-outline" size={17} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={s.todayButton} onPress={onToday}>
                    <Text style={s.todayButtonText}>{t('calendar.today')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        headerBar: {
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        monthText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        nav: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        arrowButton: {
            padding: 4,
            borderRadius: 4,
            marginHorizontal: 4,
        },
        todayButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: colors.primary,
            marginLeft: 8,
        },
        todayButtonText: {
            fontSize: 14,
            color: '#fff',
            fontWeight: '600',
        },
    });
