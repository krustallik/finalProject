// src/navigation/CustomDrawer.js
import React, { useContext, useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ThemeCtx } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { LangCtx } from '../i18n/LanguageProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

export default function CustomDrawer(props) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { themeName, toggleTheme } = useContext(ThemeCtx);

    const [langOpen, setLangOpen] = useState(false);
    const { lang, setLang } = useContext(LangCtx);

    const [isAuthed, setIsAuthed] = useState(false);

    // простий чек токена з AsyncStorage
    const checkAuth = async () => {
        const token = await AsyncStorage.getItem('token');
        setIsAuthed(!!token);
    };

    useEffect(() => {
        checkAuth();
        const unsub = props.navigation.addListener('focus', checkAuth);
        return unsub;
    }, [props.navigation]);

    const s = makeStyles(colors);

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'user']);
            delete api.defaults.headers.common.Authorization;
            setIsAuthed(false);
        } finally {
            props.navigation.closeDrawer();
        }
    };

    const handleGoAuth = () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('Auth');
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={s.container}>
            <DrawerItemList {...props} />

            {/* Тема */}
            <View style={s.rowBetween}>
                <Text style={s.label}>{t('drawer.themeDark')}</Text>
                <Switch
                    value={themeName === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={themeName === 'dark' ? '#fff' : '#f4f3f4'}
                />
            </View>

            {/* Мова */}
            <View style={s.langBlock}>
                <TouchableOpacity onPress={() => setLangOpen(v => !v)} style={s.langHeader}>
                    <Text style={s.label}>
                        {t('drawer.lang')}: {lang === 'uk' ? 'Українська' : 'English'} {langOpen ? '▲' : '▼'}
                    </Text>
                </TouchableOpacity>

                {langOpen && (
                    <View style={s.dropdown}>
                        {[
                            { code: 'uk', label: 'Українська' },
                            { code: 'en', label: 'English' },
                        ].map((item, i) => {
                            const active = lang === item.code;
                            return (
                                <TouchableOpacity
                                    key={item.code}
                                    onPress={() => { setLang(item.code); setLangOpen(false); }}
                                    style={[s.option, i === 0 && s.optionBorder, active && s.optionActive]}
                                >
                                    <Text style={[s.optionText, active && s.optionTextActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* Кнопка входу / виходу */}
            <View style={s.logoutWrap}>
                {isAuthed ? (
                    <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
                        <Text style={s.logoutText}>{t('drawer.logout')}</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleGoAuth} style={s.loginBtn}>
                        <Text style={s.loginText}>
                            {t('auth.loginTitle')} / {t('auth.registerTitle')}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </DrawerContentScrollView>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },

        label: { fontSize: 16, color: colors.text },

        rowBetween: {
            paddingHorizontal: 16,
            paddingTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },

        langBlock: { paddingHorizontal: 16, paddingTop: 16 },
        langHeader: { paddingVertical: 8 },

        dropdown: {
            marginTop: 8,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: colors.card,
        },

        option: {
            paddingVertical: 10,
            paddingHorizontal: 12,
            backgroundColor: colors.card,
        },
        optionBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
        optionActive: { borderLeftWidth: 4, borderLeftColor: colors.primary },
        optionText: { fontWeight: '500', color: colors.text },
        optionTextActive: { fontWeight: '700', color: colors.primary },

        logoutWrap: { paddingHorizontal: 16, paddingVertical: 16 },
        logoutBtn: { paddingVertical: 10 },
        logoutText: { fontSize: 16, color: colors.notification || '#e53935' },

        loginBtn: { paddingVertical: 10 },
        loginText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
    });
