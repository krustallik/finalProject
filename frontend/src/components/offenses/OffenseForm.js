import React, {useCallback, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * OffenseForm
 *
 * Презентаційна форма створення порушення:
 *  - показує/змінює фото,
 *  - вибір категорії,
 *  - опис,
 *  - кнопки Скасувати/Зберегти.
 *
 * Props:
 *  - imageBase64: string|null — поточне фото у base64 (або null, щоб запропонувати зробити фото)
 *  - onChangePhoto: () => void — викликається щоб зробити/змінити фото
 *  - onSaved: ({ description, category, imageBase64 }) => void — submit форми
 *  - loading: boolean — блокує кнопки на час збереження
 *  - onCancel: () => void — скинути форму/фото
 */

export default function OffenseForm({
                                        imageBase64,
                                        onChangePhoto,
                                        onSaved,
                                        loading = false,
                                        onCancel,
                                    }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    // локальний стан форми
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [ddOpen, setDdOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // словник категорій
    const CATEGORIES = [
        { key: 'traffic',   label: t('offense.categories.traffic') },
        { key: 'vandalism', label: t('offense.categories.vandalism') },
        { key: 'theft',     label: t('offense.categories.theft') },
        { key: 'noise',     label: t('offense.categories.noise') },
        { key: 'parking',   label: t('offense.categories.parking') },
        { key: 'other',     label: t('offense.categories.other') },
    ];

    // перевірка авторизації (показуємо вимогу увійти перед фотозйомкою)
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const token = await AsyncStorage.getItem('token');
                setIsLoggedIn(!!token);
            })();
        }, [])
    );

    const selectedLabel =
        CATEGORIES.find((c) => c.key === category)?.label || t('offense.selectCategory');

    // submit форми
    const handleSave = () => {
        if (!description.trim()) {
            alert(`${t('alerts.descriptionRequiredTitle')}\n${t('alerts.descriptionRequiredMessage')}`);
            return;
        }
        onSaved?.({ description: description.trim(), category, imageBase64 });
        // скидання локального стану
        setDescription('');
        setCategory('');
        setDdOpen(false);
    };

    // скасування відправки порушення
    const handleCancel = () => {
        setDescription('');
        setCategory('');
        setDdOpen(false);
        onCancel?.();
    };

    // перевірка логіну перед спробою зробити фото
    const handleTakePhoto = () => {
        if (!isLoggedIn) {
            Alert.alert(
                t('alerts.authRequiredTitle', 'Потрібна авторизація'),
                t('alerts.authRequiredMessage', 'Увійдіть у свій акаунт, щоб створити правопорушення.')
            );
            return;
        }
        onChangePhoto?.();
    };

    // якщо фото ще немає — показуємо кнопку "Зробити фото"
    if (!imageBase64) {
        return (
            <View style={s.card}>
                <TouchableOpacity
                    style={[s.primaryBtn, loading && s.btnDisabled]}
                    onPress={handleTakePhoto}
                    disabled={loading}
                >
                    <Text style={s.primaryBtnText}>
                        {t('offense.takePhoto', 'Take Photo')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={s.card}>
            {/* превʼю фото, яке зробив користувач */}
            <Image
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                style={s.image}
                resizeMode="cover"
            />

            {/* кнопка для заміни фото */}
            <TouchableOpacity
                style={[s.outlineBtn, loading && s.btnDisabled]}
                onPress={onChangePhoto}
                disabled={loading}
            >
                <Text style={s.outlineBtnText}>{t('offense.changePhoto')}</Text>
            </TouchableOpacity>

            {/* блок вибору категорії правопорушення */}
            <View style={s.fieldBlock}>
                <Text style={s.label}>{t('offense.categoryLabel')}</Text>

                {/* кнопка для відкриття/закриття дропдауну */}
                <TouchableOpacity
                    style={s.dropdownToggle}
                    onPress={() => setDdOpen((v) => !v)}
                    activeOpacity={0.8}
                >
                    <Text style={s.dropdownToggleText}>{selectedLabel}</Text>
                    <Text style={s.dropdownCaret}>{ddOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {/* список категорій, якщо дропдаун відкритий */}
                {ddOpen && (
                    <View style={s.dropdownMenu}>
                        {CATEGORIES.map((opt, idx) => {
                            const active = opt.key === category;
                            return (
                                <TouchableOpacity
                                    key={opt.key}
                                    style={[
                                        s.dropdownItem,
                                        idx < CATEGORIES.length - 1 && s.dropdownDivider,
                                        active && s.dropdownItemActive,
                                    ]}
                                    onPress={() => {
                                        setCategory(opt.key);
                                        setDdOpen(false);
                                    }}
                                >
                                    <Text style={[s.dropdownItemText, active && s.dropdownItemTextActive]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </View>

            {/* блок для вводу опису правопорушення */}
            <View style={s.fieldBlock}>
                <Text style={s.label}>{t('offense.descriptionLabel')}</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t('offense.descriptionPlaceholder')}
                    placeholderTextColor={colors.border}
                    multiline
                    style={s.input}
                    returnKeyType="done"
                    blurOnSubmit
                />
            </View>

            {/* кнопки "Скасувати" та "Зберегти" */}
            <View style={s.btnRow}>
                <TouchableOpacity
                    style={[s.secondaryBtn, loading && s.btnDisabled]}
                    onPress={handleCancel}
                    disabled={loading}
                >
                    <Text style={s.secondaryBtnText}>{t('common.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[s.primaryBtn, loading && s.btnDisabled]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <Text style={s.primaryBtnTextOnFill}>{t('common.save')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
        },
        image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },

        fieldBlock: { marginTop: 8 },
        label: { color: colors.text, opacity: 0.8, marginBottom: 6, fontWeight: '600' },

        dropdownToggle: {
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        dropdownToggleText: { color: colors.text },
        dropdownCaret: { color: colors.text, opacity: 0.7 },
        dropdownMenu: {
            marginTop: 6,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 10,
            overflow: 'hidden',
        },
        dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },
        dropdownDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
        dropdownItemActive: { backgroundColor: colors.background },
        dropdownItemText: { color: colors.text },
        dropdownItemTextActive: { color: colors.primary, fontWeight: '700' },

        input: {
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 12,
            minHeight: 44,
        },

        btnRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
        primaryBtn: {
            flex: 1,
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryBtnTextOnFill: { color: '#fff', fontSize: 16, fontWeight: '700' },

        primaryBtnText: { color: colors.text, fontSize: 16, fontWeight: '700' },

        secondaryBtn: {
            flex: 1,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
        },
        secondaryBtnText: { color: colors.text, fontSize: 16, fontWeight: '600' },

        outlineBtn: {
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 8,
        },
        outlineBtnText: { color: colors.text, fontWeight: '600' },

        btnDisabled: { opacity: 0.6 },
    });
