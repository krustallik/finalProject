import React, { useEffect, useState, useCallback } from 'react';
import {View, Text, Alert, StyleSheet, ActivityIndicator} from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

import { initDb } from '../db/database';
import {
    listOffenses,
    deleteOffense,
    createLocal,
    createSynced,
} from '../repositories/offensesRepo';
import OffenseForm from '../components/offenses/OffenseForm';
import OffenseList from '../components/offenses/OffenseList';
import { uploadBase64ToCloudinary } from '../services/cloudinary';
import { isOnline } from '../services/network';
import { syncPendingOffenses } from '../services/sync';

export default function CreateOffenseScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const [items, setItems] = useState([]);
    const [imageBase64, setImageBase64] = useState(null);
    const [saving, setSaving] = useState(false);

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
                if (await isOnline()) await syncPendingOffenses();
                await load();
            } catch (e) {
                console.error('DB init error', e);
            }
        })();
    }, []);

    useFocusEffect(useCallback(() => { load(); }, []));

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('alerts.cameraDeniedTitle'), t('alerts.cameraDeniedMessage'));
            return;
        }
        const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
        if (!res.canceled && res.assets?.[0]?.base64) setImageBase64(res.assets[0].base64);
    };

    const handleSave = async ({ description, category, imageBase64 }) => {
        const created_at = new Date().toISOString();
        setSaving(true);
        try {
            if (await isOnline()) {
                const { secure_url, public_id } = await uploadBase64ToCloudinary(imageBase64);
                console.log('READY FOR BACKEND:', { description, category, photo_url: secure_url, photo_id: public_id, created_at });
                await createSynced({ description, category, photo_url: secure_url, photo_id: public_id, createdAt: created_at });
                Alert.alert('OK', 'Фото завантажено у хмару.');
            } else {
                await createLocal({ description, category, imageBase64, createdAt: created_at });
                Alert.alert('OK', 'Збережено локально (офлайн).');
            }
            setImageBase64(null);
            await load();
        } catch (e) {
            console.warn('Save error:', e.message);
            try {
                await createLocal({ description, category, imageBase64, createdAt: created_at });
                Alert.alert('OK', 'Сервер недоступний. Збережено локально.');
                setImageBase64(null);
                await load();
            } catch {
                Alert.alert('Помилка', 'Не вдалося зберегти запис.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        await deleteOffense(id);
        await load();
    };

    return (
        <View style={s.container}>
            <Text style={s.title}>{t('screens.createTitle')}</Text>

            {/* передаємо прапорець у форму */}
            <OffenseForm
                imageBase64={imageBase64}
                onChangePhoto={saving ? undefined : takePhoto}
                onSaved={handleSave}
                loading={saving}
            />

            <OffenseList data={items} onDelete={saving ? () => {} : handleDelete} />

            {saving && (
                <View style={s.overlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, padding: 16 },
        title: { fontSize: 22, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 12 },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });