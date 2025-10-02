import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';


/**
 * AuthScreen
 *
 * Екран автентифікації (логін / реєстрація).
 * Дозволяє користувачеві увійти, створити акаунт або увійти як гість.
 *
 * State:
 * - mode: "login" | "register"
 * - email, password, name: введені дані
 * - loading: індикатор процесу
 *
 * Поведінка:
 * - handleSubmit: виконує запит логіну або реєстрації → зберігає токен у AsyncStorage
 * - switchMode: перемикає між режимами
 * - handleGuest: очищає дані та входить як гість
 */

export default function AuthScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    // локальний стан екрану
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // перемикання режиму логін/реєстрація
    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setEmail(''); setPassword(''); setName('');
    };

    // відправка даних на сервер
    const handleSubmit = async () => {
        try {
            // базова валідація
            if (!email.trim() || !password.trim()) {
                Alert.alert('Error', 'Email and password are required');
                return;
            }
            setLoading(true);

            let res;
            if (mode === 'login') {
                // логін
                res = await api.post('/auth/login', { email: email.trim(), password: password.trim() });
            } else {
                // реєстрація
                if (!name.trim()) { Alert.alert('Error', 'Name is required'); return; }
                res = await api.post('/auth/register', {
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim(),
                });
            }

            // зберігаємо токен і користувача
            const { token, user } = res.data || {};
            await AsyncStorage.setItem('token', token || '');
            await AsyncStorage.setItem('user', JSON.stringify(user || {}));

            if (token) {
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
            }

            // перехід у головний екран
            navigation.navigate('Main');
        } catch (err) {
            console.warn(err?.response?.data || err.message);
            const msg = err?.response?.data?.message || 'Authentication error';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    // вхід як гість (очистка токену)
    const handleGuest = async () => {
        await AsyncStorage.multiRemove(['token', 'user']);
        delete api.defaults.headers.common.Authorization;
        navigation.navigate('Main');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* заголовок */}
            <Text style={[styles.title, { color: colors.text }]}>
                {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </Text>

            {/* поле для імені тільки у режимі реєстрації */}
            {mode === 'register' && (
                <TextInput
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                    placeholder={t('auth.namePlaceholder')}
                    placeholderTextColor={colors.border}
                    value={name}
                    onChangeText={setName}
                />
            )}

            {/* email */}
            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={colors.border}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* пароль */}
            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={colors.border}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* кнопка логін / реєстрація */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
                </Text>
            </TouchableOpacity>

            {/* перемикання режимів */}
            <TouchableOpacity onPress={switchMode} disabled={loading}>
                <Text style={[styles.switchText, { color: colors.primary }]}>
                    {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
                </Text>
            </TouchableOpacity>

            {/* вхід як гість */}
            <TouchableOpacity onPress={handleGuest} disabled={loading} style={{ marginTop: 20 }}>
                <Text style={[styles.switchText, { color: colors.primary }]}>
                    {t('auth.guestLogin', 'Увійти як гість')}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
    input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 16 },
    button: { padding: 14, borderRadius: 10, marginTop: 8, marginBottom: 16 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600', fontSize: 16 },
    switchText: { textAlign: 'center', fontSize: 14 },
});
