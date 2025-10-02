import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { format } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import CalendarHeader from './CalendarHeader';
import Day from './Day';
import { getCalendarDays } from '../../scripts/dateCalculating';

/**
 * Calendar component
 *
 * Відображає календар з можливістю навігації по місяцях та вибору конкретного дня.
 * Використовується як презентаційний компонент, стан (currentDate, selectedDate) контролюється з батьківського рівня.
 *
 * Props:
 * @param {Date} currentDate   - перший день місяця, який зараз відображається
 * @param {Date} selectedDate  - день, який обрано (підсвічений)
 * @param {function(Date):void} onSelectDate - викликається при виборі конкретного дня
 * @param {function(Date):void} onMonthChange - викликається при зміні місяця (prev/next/today)
 * @param {string[]} datesWithTasks - масив дат у форматі 'yyyy-MM-dd', для яких є події
 *
 * Використовує допоміжні компоненти:
 * - CalendarHeader: шапка з назвою місяця та кнопками навігації
 * - Day: клітинка одного дня
 */


export default function Calendar(props) {
    // отримуємо дані і колбеки з батька
    const { currentDate, selectedDate, onSelectDate, onMonthChange, datesWithTasks = [] } = props;
    const { colors } = useTheme();
    const { t, i18n } = useTranslation();
    const s = makeStyles(colors);

    // розрахунок розмірів календаря
    const { width, height } = useWindowDimensions();
    const calendarWidth = width * 0.9;
    const cellSize = Math.min(calendarWidth / 7, height / 8);

    // масив усіх днів для відображення (поточний місяць + сусідні)
    const days = getCalendarDays(currentDate);
    const today = new Date();

    // зміна місяця вперед/назад
    const goToMonth = (delta) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
        onMonthChange?.(newDate);
    };

    // локалізація місяця та року
    const locale = i18n.language === 'uk' ? uk : enUS;
    const monthName = format(currentDate, 'LLLL', { locale });
    const year = format(currentDate, 'yyyy');

    // локалізовані скорочення днів тижня
    const weekdays = t('calendar.weekdaysShort', { returnObjects: true });

    return (
        <View style={[s.container, { width: calendarWidth }]}>
            {/* шапка з назвою місяця і кнопками */}
            <CalendarHeader
                month={monthName}
                year={year}
                onPrev={() => goToMonth(-1)}
                onNext={() => goToMonth(1)}
                onToday={() => onMonthChange?.(new Date())}
            />

            {/* рядок назв днів тижня */}
            <View style={s.dayNames}>
                {weekdays.map((d, i) => (
                    <Text key={i} style={[s.dayNameText, { width: cellSize }]}>
                        {d}
                    </Text>
                ))}
            </View>

            {/* сітка календаря */}
            <View style={s.grid}>
                {days.map((obj, index) => {
                    const date = obj.date;
                    const isCurrentMonth = obj.current;
                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const hasOffenses = datesWithTasks.includes(format(date, 'yyyy-MM-dd'));

                    return (
                        <Day
                            key={index}
                            date={date}
                            isCurrentMonth={isCurrentMonth}
                            isToday={isToday}
                            selected={isSelected}
                            hasOffenses={hasOffenses}
                            cellSize={cellSize}
                            onPress={onSelectDate}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            backgroundColor: colors.card,
            paddingVertical: 16,
            borderRadius: 12,
        },
        dayNames: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 8,
        },
        dayNameText: {
            textAlign: 'center',
            fontSize: 14,
            color: colors.text,
            opacity: 0.8,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
    });
