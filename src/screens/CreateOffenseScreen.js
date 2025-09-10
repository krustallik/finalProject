import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';          // << додано

import { initDb } from '../db/database';
import { listOffenses, deleteOffense, createLocal, createSynced } from '../repositories/offensesRepo';
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
    const [coords, setCoords] = useState(null);       // << стан координат
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const rows = await listOffenses();
        setItems(rows);
    };

    useEffect(() => {
        (async () => {
            await initDb();
            await load();
            if (await isOnline()) await syncPendingOffenses();
            await load();
        })();
    }, []);

    useFocusEffect(useCallback(() => { load(); }, []));

    const takePhoto = async () => {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        if (cam.status !== 'granted') { Alert.alert(t('alerts.cameraDeniedTitle'), t('alerts.cameraDeniedMessage')); return; }

        const loc = await Location.requestForegroundPermissionsAsync();   // дозвіл на гео
        if (loc.status !== 'granted') { Alert.alert('Location denied', 'Enable location access.'); return; }

        const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
        if (res.canceled || !res.assets?.[0]?.base64) return;

        setImageBase64(res.assets[0].base64);

        // поточні координати
        const pos = await Location.getCurrentPositionAsync({});
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    };

    const handleSave = async ({ description, category, imageBase64 }) => {
        const created_at = new Date().toISOString();
        setSaving(true);
        try {
            if (await isOnline()) {
                const { secure_url, public_id } = await uploadBase64ToCloudinary(imageBase64);
                await createSynced({
                    description, category,
                    photo_url: secure_url, photo_id: public_id,
                    createdAt: created_at,
                    coords,                                     // << передаємо гео
                });
                Alert.alert('OK', 'Фото завантажено у хмару.');
            } else {
                await createLocal({ description, category, imageBase64, createdAt: created_at, coords }); // << тут теж
                Alert.alert('OK', 'Збережено локально (офлайн).');
            }
            setImageBase64(null);
            setCoords(null);                                  // << скидаємо гео
            await load();
        } catch (e) {
            try {
                await createLocal({ description, category, imageBase64, createdAt: created_at, coords });
                setImageBase64(null);
                setCoords(null);
                await load();
                Alert.alert('OK', 'Сервер недоступний. Збережено локально.');
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

            <OffenseForm
                imageBase64={imageBase64}
                onChangePhoto={saving ? undefined : takePhoto}
                onSaved={handleSave}
                loading={saving}
            />

            {/* (необов’язково) Підказка з координатами після зйомки */}
            {coords && (
                <Text style={{ textAlign:'center', opacity:0.7, marginBottom:8 }}>
                    {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
                </Text>
            )}

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
