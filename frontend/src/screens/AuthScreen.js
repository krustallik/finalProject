import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

export default function AuthScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setEmail(''); setPassword(''); setName('');
    };

    const handleSubmit = async () => {
        try {
            if (!email.trim() || !password.trim()) {
                Alert.alert('Error', 'Email and password are required');
                return;
            }
            setLoading(true);

            let res;
            if (mode === 'login') {
                res = await api.post('/auth/login', { email: email.trim(), password: password.trim() });
            } else {
                if (!name.trim()) { Alert.alert('Error', 'Name is required'); return; }
                res = await api.post('/auth/register', {
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim(),
                });
            }

            const { token, user } = res.data || {};
            await AsyncStorage.setItem('token', token || '');
            await AsyncStorage.setItem('user', JSON.stringify(user || {}));

            navigation.replace('Main'); // твоє кореневе дерево вкладок/дровера
        } catch (err) {
            console.warn(err?.response?.data || err.message);
            const msg = err?.response?.data?.message || 'Authentication error';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>
                {mode === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
            </Text>

            {mode === 'register' && (
                <TextInput
                    style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                    placeholder={t('auth.namePlaceholder')}
                    placeholderTextColor={colors.border}
                    value={name}
                    onChangeText={setName}
                />
            )}

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={colors.border}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={colors.border}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={switchMode} disabled={loading}>
                <Text style={[styles.switchText, { color: colors.primary }]}>
                    {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
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
