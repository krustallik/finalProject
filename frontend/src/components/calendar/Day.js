import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';


/**
 * Day
 *
 * Клітинка календаря, яка відображає одну дату.
 * Може бути виділеною, сьогоднішньою, поза поточним місяцем,
 * або мати індикатор подій (крапку).
 *
 * Props:
 * @param {Date} date             - дата цього дня
 * @param {boolean} isCurrentMonth - чи належить дата поточному місяцю
 * @param {boolean} isToday        - чи це сьогоднішній день
 * @param {boolean} selected       - чи обраний цей день
 * @param {boolean} hasOffenses       - чи є порушення у цей день
 * @param {number} cellSize        - розмір клітинки (px)
 * @param {function(Date):void} onPress - викликається при натисканні на день
 */


export default function Day(props) {
    const { date, isCurrentMonth, isToday, selected, hasOffenses, cellSize, onPress } = props;
    const { colors } = useTheme();
    const s = makeStyles(colors, cellSize);

    return (
        <TouchableOpacity style={s.dayCell} onPress={() => onPress?.(date)} activeOpacity={0.7}>
            <View style={[s.inner, selected && s.selected]}>
                {/* якщо сьогодні — малюємо синій круг */}
                {isToday ? (
                    <View style={s.todayBubble}>
                        <Text style={s.todayText}>{date.getDate()}</Text>
                    </View>
                ) : (
                    <Text style={[s.dayText, !isCurrentMonth && s.dimmed]}>
                        {date.getDate()}
                    </Text>
                )}

                {/* крапка для позначення днів з порушеннями */}
                {hasOffenses ? <View style={s.taskDot} /> : null}
            </View>
        </TouchableOpacity>
    );
}


const makeStyles = (colors, cellSize) =>
    StyleSheet.create({
        dayCell: { alignItems: 'center', justifyContent: 'center', width: cellSize, height: cellSize },
        inner: { alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
        selected: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: 8 },
        dayText: { fontSize: 16, color: colors.text },
        dimmed: { color: colors.border },
        todayBubble: {
            backgroundColor: colors.primary,
            width: cellSize * 0.8,
            height: cellSize * 0.8,
            borderRadius: (cellSize * 0.8) / 2,
            alignItems: 'center',
            justifyContent: 'center',
        },
        todayText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
        taskDot: {
            position: 'absolute',
            bottom: 6,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.notification || '#e11d48',
        },
    });
