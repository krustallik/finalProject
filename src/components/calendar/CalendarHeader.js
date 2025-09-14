// src/components/CalendarHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CalendarHeader({
                                           month,
                                           year,
                                           onPrev,
                                           onNext,
                                           onToday,
                                       }) {
    return (
        <View style={styles.headerBar}>
            <Text style={styles.monthText}>{month} {year} р.</Text>
            <View style={styles.nav}>
                <TouchableOpacity style={styles.arrowButton} onPress={onPrev}>
                  <Ionicons name="arrow-up-outline" size={17} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.arrowButton} onPress={onNext}>
                    <Ionicons name="arrow-down-outline" size={17} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.todayButton} onPress={onToday}>
                    <Text style={styles.todayButtonText}>Сьогодні</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        color: '#000',
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
        borderRadius: 4,
        backgroundColor: '#0078d7',
        marginLeft: 8,
    },
    todayButtonText: {
        fontSize: 14,
        color: '#fff',
    },
});
