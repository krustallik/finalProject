import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function OffenseItem({ item, onDelete }) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    return (
        <View style={s.card}>
            <View style={s.actions}>
                <TouchableOpacity onPress={onDelete} style={s.deleteBtn}>
                    <Text style={s.deleteBtnText}>{t('common.delete')}</Text>
                </TouchableOpacity>
            </View>

            {!!(item.image_base64 || item.photo_url) && (
                <Image
                    source={{
                        uri: item.image_base64
                            ? `data:image/jpeg;base64,${item.image_base64}`
                            : (item.photoUrl || item.photo_url),
                    }}
                    style={s.image}
                    resizeMode="cover"
                />
            )}


            <Text style={s.title}>{item.description}</Text>

            {!!item.category && (
                <Text style={s.category}>
                    Категорія: {item.category}
                </Text>
            )}

            {item.userName && (
                <Text style={s.date}>{new Date(item.createdAt || item.createdAt).toLocaleString()}</Text>
            )}

            <Text style={s.date}>
                {new Date(item.createdAt).toLocaleString()}
            </Text>
            {(item.latitude != null && item.longitude != null) && (
                <Text style={s.coords}>
                    {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                </Text>
            )}
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.card,
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
            width: '100%',
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginBottom: 6,
        },
        deleteBtn: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#ef4444',
        },
        deleteBtnText: { color: '#ef4444', fontWeight: '600' },
        image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 8 },
        title: { color: colors.text, fontSize: 16, fontWeight: '600' },
        category: { color: colors.text, opacity: 0.7, marginTop: 2 },
        date: { color: colors.text, opacity: 0.6, marginTop: 2 },
        coords: { color: colors.text, opacity: 0.6, marginTop: 2 },
    });
