
import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format, startOfMonth } from 'date-fns';
import { listOffensesRemoteAll } from '../repositories/offensesRepo';
import Calendar from '../components/calendar/Calendar';

/**
 * CalendarScreen
 *
 * Контейнерний екран календаря.
 * Відповідає за завантаження даних (offenses) з репозиторію,
 * формування дат з порушеннями та навігацію до екрану "DayOffenses".
 *
 * State:
 * - currentDate: Date — початок поточного місяця
 * - selectedDate: Date — обраний день
 * - allOffenses: [] — масив всіх порушень
 *
 * Використовує:
 * - <Calendar> як презентаційний календар
 *
 * Батьківська логіка:
 * - onSelectDate → змінює selectedDate і виконує navigation.navigate
 * - onMonthChange → оновлює currentDate
 */


export default function CalendarScreen() {
    // кольори теми та переклади
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);
    const navigation = useNavigation();

    const [currentDate, setCurrentDate] = useState(() => startOfMonth(new Date()));
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [allOffenses, setAllOffenses] = useState([]);

    // завантаження порушень з дб
    const load = useCallback(async () => {
        const rows = await listOffensesRemoteAll();
        setAllOffenses(rows || []);
    }, []);

    useFocusEffect(useCallback(() => { load(); }, [load]));

    // форматування дати у ISO
    const fmt = (d) => format(d, 'yyyy-MM-dd');

    // вибірка дат, де є Порушення
    const datesWithOffenses = useMemo(() => {
        const set = new Set();
        for (const it of allOffenses) {
            if (!it.createdAt) continue;
            set.add(fmt(new Date(it.createdAt)));
        }
        return Array.from(set);
    }, [allOffenses]);

    return (
        <View style={s.container}>
            {/* заголовок */}
            <Text style={s.title}>{t('screens.calendarTitle')}</Text>

            {/* календар */}
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
