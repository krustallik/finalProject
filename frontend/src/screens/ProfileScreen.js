// src/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const loadFromStorage = async () => {
        const raw = await AsyncStorage.getItem('user');
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    };

    const fetchFresh = async (fallbackUser) => {
        try {
            const id = fallbackUser?.id;
            if (!id) return fallbackUser;
            const res = await api.get(`/users/${id}`);
            return res.data || fallbackUser;
        } catch {
            return fallbackUser;
        }
    };

    const load = React.useCallback(async () => {
        setLoading(true);
        const cached = await loadFromStorage();
        const latest = await fetchFresh(cached);
        setUser(latest);
        if (latest) await AsyncStorage.setItem('user', JSON.stringify(latest));
        setLoading(false);
    }, []);

    // ✅ автоматично перезавантажуємо дані щоразу, коли екран у фокусі
    useFocusEffect(
        React.useCallback(() => {
            load();
        }, [load])
    );

    if (loading) {
        return (
            <View style={[s.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[s.center, { backgroundColor: colors.background }]}>
                <Text style={s.title}>{t('screens.profile')}</Text>
                <Text style={s.subtle}>No user info</Text>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={s.container}>
            <Text style={s.title}>{t('screens.profile')}</Text>

            <View style={s.card}>
                <Text style={s.label}>{t('auth.namePlaceholder')}</Text>
                <Text style={s.value}>{user.name || '-'}</Text>

                <View style={s.divider} />

                <Text style={s.label}>{t('auth.emailPlaceholder')}</Text>
                <Text style={s.value}>{user.email || '-'}</Text>
            </View>
        </ScrollView>
    );
}

const makeStyles = (colors) => StyleSheet.create({
    container: { padding: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 16 },
    subtle: { color: colors.text, opacity: 0.6, marginTop: 8 },
    card: {
        borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
        borderRadius: 12, padding: 16, gap: 6,
    },
    label: { fontSize: 13, color: colors.text, opacity: 0.7 },
    value: { fontSize: 16, fontWeight: '600', color: colors.text },
    divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
});
