import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function AuthScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setEmail('');
        setPassword('');
        setName('');
    };

    const handleSubmit = () => {
        if (mode === 'login') {
            console.log('Login with:', { email, password });
        } else {
            console.log('Register with:', { name, email, password });
        }

        navigation.replace('Main');
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

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {mode === 'login' ? t('auth.loginBtn') : t('auth.registerBtn')}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={switchMode}>
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
