// src/components/Calendar.js
import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import CalendarHeader from './CalendarHeader';
import Day from './Day';
import {getCalendarDays} from "../../scripts/dateCalculating";

export default function Calendar(props) {
    const {
        currentDate,
        selectedDate,
        onSelectDate,
        onMonthChange,
        datesWithTasks = [],
    } = props;

    const { width,height  } = useWindowDimensions();
    const calendarWidth = width * 0.9;
    const cellSize = Math.min(calendarWidth / 7, height / 8);

    const days = getCalendarDays(currentDate);
    const today = new Date();

    function goToMonth(delta) {
        const newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + delta,
            1
        );
        if (onMonthChange) {
            onMonthChange(newDate);
        }
    }

    function goPrev() {
        goToMonth(-1);
    }

    function goNext() {
        goToMonth(1);
    }

    function goToday() {
        if (onMonthChange) {
            onMonthChange(new Date());
        }
    }

    const monthName = format(currentDate, 'LLLL', { locale: uk });
    const year = format(currentDate, 'yyyy');

    return (
        <View style={[styles.container, { width: calendarWidth }]}>
            <CalendarHeader
                month={monthName}
                year={year}
                onPrev={goPrev}
                onNext={goNext}
                onToday={goToday}
            />

            <View style={styles.dayNames}>
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d) => (
                    <Text key={d} style={[styles.dayNameText, { width: cellSize }]}>
                        {d}
                    </Text>
                ))}
            </View>

            <View style={styles.grid}>
                {days.map((obj, index) => {
                    const date = obj.date;
                    const isCurrentMonth = obj.current;
                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected =
                        selectedDate &&
                        date.toDateString() === selectedDate.toDateString();
                    const hasTasks = datesWithTasks.includes(
                        format(date, 'yyyy-MM-dd')
                    );

                    return (
                        <Day
                            key={index}
                            date={date}
                            isCurrentMonth={isCurrentMonth}
                            isToday={isToday}
                            selected={isSelected}
                            hasTasks={hasTasks}
                            cellSize={cellSize}
                            onPress={onSelectDate}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
    },
    dayNames: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
    },
    dayNameText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
