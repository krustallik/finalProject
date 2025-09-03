import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { initDb } from '../db/database';
import { createOffense, listOffenses, deleteOffense } from '../repositories/offensesRepo';
import OffenseForm from '../components/offenses/OffenseForm';
import OffenseList from '../components/offenses/OffenseList';

export default function CreateOffenseScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const [items, setItems] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);

    const load = async () => {
        const rows = await listOffenses();
        setItems(rows);
        console.log('SQLite offenses:', rows);
    };

    useEffect(() => {
        (async () => {
            try {
                await initDb();
                await load();
            } catch (e) {
                console.error('DB init error', e);
            }
        })();
    }, []);

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('alerts.cameraDeniedTitle'), t('alerts.cameraDeniedMessage'));
            return;
        }
        const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7, allowsEditing: false });
        if (!res.canceled && res.assets?.[0]?.base64) {
            setImageBase64(res.assets[0].base64);
        }
    };

    const handleSave = async (payload) => {
        await createOffense(payload);
        setImageBase64(null);
        await load();
    };

    const handleDelete = async (id) => {
        await deleteOffense(id);
        await load();
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>{t('screens.createTitle')}</Text>
            <OffenseForm imageBase64={imageBase64} onChangePhoto={takePhoto} onSaved={handleSave} />
            <OffenseList data={items} onDelete={handleDelete} />
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, padding: 16 },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 12,
        },
    });
