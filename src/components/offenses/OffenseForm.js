import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, Alert, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function OffenseForm({ imageBase64, onSaved, onChangePhoto }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');

    if (!imageBase64) {
        return (
            <View style={s.onlyBtnWrap}>
                <TouchableOpacity onPress={onChangePhoto} style={s.primaryBtn}>
                    <Text style={s.primaryBtnText}>{t('offense.takePhoto')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const save = async () => {
        if (!description.trim()) {
            Alert.alert(t('alerts.descriptionRequiredTitle'), t('alerts.descriptionRequiredMessage'));
            return;
        }
        await onSaved({ description: description.trim(), category: (category || '').trim(), imageBase64 });
        setDescription('');
        setCategory('');
    };

    return (
        <View style={s.formWrap}>
            <Image
                source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
                style={s.image}
                resizeMode="cover"
            />

            <TouchableOpacity onPress={onChangePhoto} style={s.changeBtn}>
                <Text style={s.changeBtnText}>{t('offense.changePhoto')}</Text>
            </TouchableOpacity>

            <TextInput
                placeholder={t('offense.descriptionPlaceholder')}
                placeholderTextColor={colors.border}
                value={description}
                onChangeText={setDescription}
                style={s.input}
            />

            <TextInput
                placeholder={t('offense.categoryPlaceholder')}
                placeholderTextColor={colors.border}
                value={category}
                onChangeText={setCategory}
                style={s.input}
            />

            <TouchableOpacity onPress={save} style={s.saveBtn}>
                <Text style={s.saveBtnText}>{t('common.save')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        onlyBtnWrap: { marginBottom: 14 },
        primaryBtn: {
            backgroundColor: colors.primary ?? '#3b82f6',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
        },
        primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

        formWrap: { gap: 10, marginBottom: 14 },
        image: { width: '100%', height: 220, borderRadius: 10 },

        changeBtn: {
            borderWidth: 1,
            borderColor: colors.border,
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
        },
        changeBtnText: { color: colors.text },

        input: {
            borderWidth: 1,
            borderColor: colors.border,
            color: colors.text,
            padding: 12,
            borderRadius: 10,
        },

        saveBtn: {
            backgroundColor: colors.primary ?? '#3b82f6',
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
        },
        saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    });
