import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Day(props) {
    const { date, isCurrentMonth, isToday, selected, hasTasks, cellSize, onPress } = props;

    const handlePress = () => {
        if (onPress) {
            onPress(date);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.dayCell, { width: cellSize, height: cellSize }]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={[styles.inner, selected ? styles.selected : null]}>
                {isToday ? (
                    <View
                        style={{
                            backgroundColor: '#4cc2ff',
                            width: cellSize * 0.8,
                            height: cellSize * 0.8,
                            borderRadius: (cellSize * 0.8) / 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={styles.todayText}>{date.getDate()}</Text>
                    </View>
                ) : (
                    <Text style={[styles.dayText, !isCurrentMonth ? styles.dimmed : null]}>
                        {date.getDate()}
                    </Text>
                )}

                {hasTasks ? <View style={styles.taskDot} /> : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dayCell: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    inner: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    selected: {
        borderWidth: 1.5,
        borderColor: '#0078d7',
        borderRadius: 8,
    },
    dayText: {
        fontSize: 16,
        color: '#000',
    },
    dimmed: {
        color: 'gray',
    },
    todayText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    taskDot: {
        position: 'absolute',
        bottom: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'red',
    },
});
