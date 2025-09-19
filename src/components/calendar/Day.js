import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function Day(props) {
    const { date, isCurrentMonth, isToday, selected, hasTasks, cellSize, onPress } = props;
    const { colors } = useTheme();
    const s = makeStyles(colors, cellSize);

    return (
        <TouchableOpacity style={s.dayCell} onPress={() => onPress?.(date)} activeOpacity={0.7}>
            <View style={[s.inner, selected && s.selected]}>
                {isToday ? (
                    <View style={s.todayBubble}>
                        <Text style={s.todayText}>{date.getDate()}</Text>
                    </View>
                ) : (
                    <Text style={[s.dayText, !isCurrentMonth && s.dimmed]}>{date.getDate()}</Text>
                )}

                {hasTasks ? <View style={s.taskDot} /> : null}
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
            backgroundColor: colors.notification || '#e11d48', // рожево-червоний як дефолт
        },
    });
