import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

/**
 * ProfileScreen
 *
 * Екран профілю користувача.
 * Завантажує дані користувача з AsyncStorage і намагається отримати свіжі дані з сервера.
 * Якщо користувач не авторизований — показує кнопку переходу на екран автентифікації.
 *
 * State:
 * - user: інформація про користувача або null
 * - loading: чи триває завантаження
 */
export default function ProfileScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);
    const navigation = useNavigation();

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // зчитування даних з AsyncStorage
    const loadFromStorage = async () => {
        const raw = await AsyncStorage.getItem('user');
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    };

    // отримання актуальних даних з API
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

    // основне завантаження даних
    const load = React.useCallback(async () => {
        setLoading(true);
        const cached = await loadFromStorage();
        const latest = await fetchFresh(cached);
        setUser(latest);
        if (latest) await AsyncStorage.setItem('user', JSON.stringify(latest));
        setLoading(false);
    }, []);

    // автоперезавантаження щоразу, коли екран у фокусі
    useFocusEffect(
        React.useCallback(() => {
            load();
        }, [load])
    );

    // перехід до екрана авторизації
    const handleGoAuth = () => {
        navigation.navigate('Auth');
    };

    // стан завантаження
    if (loading) {
        return (
            <View style={[s.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator />
            </View>
        );
    }

    // користувач не знайдений (гостьовий режим)
    if (!user) {
        return (
            <View style={[s.center, { backgroundColor: colors.background }]}>
                <Text style={s.title}>{t('screens.profile')}</Text>
                <Text style={s.subtle}>No user info</Text>
                {/* кнопка переходу на екран входу */}
                <View style={s.logoutWrap}>
                    <TouchableOpacity onPress={handleGoAuth} style={s.loginBtn}>
                        <Text style={s.loginText}>
                            {t('auth.loginTitle')} / {t('auth.registerTitle')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // відображення профілю користувача
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={s.container}
        >
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

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { padding: 16 },
        center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 16,
        },
        subtle: { color: colors.text, opacity: 0.6, marginTop: 8 },
        card: {
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 16,
            gap: 6,
        },
        label: { fontSize: 13, color: colors.text, opacity: 0.7 },
        value: { fontSize: 16, fontWeight: '600', color: colors.text },
        divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
        loginBtn: { paddingVertical: 10 },
        loginText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
    });