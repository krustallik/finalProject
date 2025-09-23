
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth } from 'date-fns';
import { listOffensesRemoteAll, deleteOffenseRemoteById } from '../repositories/offensesRepo';
import Calendar from '../components/calendar/Calendar';

export default function CalendarScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);
    const navigation = useNavigation();

    const [currentDate, setCurrentDate] = useState(() => startOfMonth(new Date()));
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [allOffenses, setAllOffenses] = useState([]);

    const load = useCallback(async () => {
        const rows = await listOffensesRemoteAll();
        setAllOffenses(rows || []);
    }, []);

    // 1) первинне завантаження
    useEffect(() => { load(); }, [load]);

    // 2) автооновлення КОЖНОГО разу, коли заходиш на календар (фокус табу/стеку)
    useFocusEffect(useCallback(() => { load(); }, [load]));

    const fmt = (d) => format(d, 'yyyy-MM-dd');

    const datesWithOffenses = useMemo(() => {
        const set = new Set();
        for (const it of allOffenses) {
            if (!it.createdAt) continue;
            set.add(fmt(new Date(it.createdAt)));
        }
        return Array.from(set);
    }, [allOffenses]);

    const dayItems = useMemo(() => {
        const key = fmt(selectedDate);
        return (allOffenses || []).filter((it) => {
            if (!it.createdAt) return false;
            return fmt(new Date(it.createdAt)) === key;
        });
    }, [allOffenses, selectedDate]);


    return (
        <View style={s.container}>
            <Text style={s.title}>{t('screens.calendarTitle')}</Text>

            <Calendar
                currentDate={currentDate}
                selectedDate={selectedDate}
                onSelectDate={(d) => {
                    setSelectedDate(d);
                    navigation.navigate('DayOffenses', { dateISO: fmt(d) });
                }}
                onMonthChange={(d) => setCurrentDate(startOfMonth(d))}
                datesWithTasks={datesWithOffenses}
            />
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background, paddingVertical: 8 },
        title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 8 },
        listWrap: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
        empty: { textAlign: 'center', color: colors.text, opacity: 0.6, marginTop: 12 },
    });
