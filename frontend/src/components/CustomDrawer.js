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

/**
 * CustomDrawer
 *
 * Кастомний вміст DrawerMenu:
 * - список сторінок (DrawerItemList)
 * - перемикач теми
 * - вибір мови
 * - кнопка входу / виходу
 *
 * State:
 * - isAuthed: чи є збережений токен
 * - langOpen: чи відкритий список мов
 *
 *  Props (передаються автоматично з Drawer.Navigator):
 *  @param {object} props.navigation  - об’єкт навігації Drawer
 *  @param {object} props.state       - стан Drawer-навігатора
 *  @param {function} props.descriptors - дескриптори для кожного екрана
 *
 */

export default function CustomDrawer(props) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { themeName, toggleTheme } = useContext(ThemeCtx);
    const { lang, setLang } = useContext(LangCtx);

    const [langOpen, setLangOpen] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // чек токена з AsyncStorage
    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsAuthed(!!token);
        } catch (e) {
            console.warn('Auth check failed', e);
            setIsAuthed(false);
        }
    };

    // перевірка при фокусі навігації
    useEffect(() => {
        checkAuth();
        return props.navigation.addListener('focus', checkAuth);
    }, [props.navigation]);


    const s = makeStyles(colors);

    // вихід
    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'user']);
            delete api.defaults.headers.common.Authorization;
            setIsAuthed(false);
        } finally {
            props.navigation.closeDrawer();
        }
    };

    // перехід на екран автентифікації
    const handleGoAuth = () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('Auth');
    };

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={s.container}>
            {/* стандартні елементи Drawer */}
            <DrawerItemList {...props} />

            {/* перемикач теми */}
            <View style={s.rowBetween}>
                <Text style={s.label}>{t('drawer.themeDark')}</Text>
                <Switch
                    value={themeName === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={themeName === 'dark' ? '#fff' : '#f4f3f4'}
                />
            </View>

            {/* вибір мови */}
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
                                    onPress={() => {
                                        setLang(item.code);
                                        setLangOpen(false);
                                    }}
                                    style={[s.option, i === 0 && s.optionBorder, active && s.optionActive]}
                                >
                                    <Text style={[s.optionText, active && s.optionTextActive]}>{item.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* кнопка входу/виходу */}
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
