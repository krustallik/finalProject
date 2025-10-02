import React, {useEffect, useState, useRef} from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { initDb } from '../db/database';
import {
    createRemoteOffense,
    createLocalOffense,
} from '../repositories/offensesRepo';
import OffenseForm from '../components/offenses/OffenseForm';
import { uploadBase64ToCloudinary } from '../services/cloudinary';
import { isOnline } from '../services/network';

/**
 * CreateOffenseScreen
 *
 * Екран створення порушення:
 *  - робить фото (камера), бере координати (геолокація),
 *  - при онлайні вантажить фото у хмару та створює запис на сервері,
 *  - при офлайні зберігає локально в БД (sqlite).
 *
 * State:
 *  - imageBase64: string|null — знімок у base64 для попереднього перегляду/завантаження
 *  - coords: {latitude, longitude}|null — координати місця
 *  - saving: boolean — індикатор збереження
 *
 * Примітка: використовує локальний прапор submittingRef, щоб запобігти дабл-клікам.
 */
export default function CreateOffenseScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);
    const submittingRef = useRef(false);

    const [imageBase64, setImageBase64] = useState(null);
    const [coords, setCoords] = useState(null);
    const [saving, setSaving] = useState(false);

    // ініціалізація БД + перше оновлення
    useEffect(() => {
        (async () => {
            await initDb();
        })();
    }, []);


    // зробити фото + запросити геолокацію
    const takePhoto = async () => {
        const cam = await ImagePicker.requestCameraPermissionsAsync();
        if (cam.status !== 'granted') {
            Alert.alert(t('alerts.cameraDeniedTitle'), t('alerts.cameraDeniedMessage'));
            return;
        }

        const loc = await Location.requestForegroundPermissionsAsync();
        if (loc.status !== 'granted') {
            Alert.alert('Location denied', 'Enable location access.');
            return;
        }

        const res = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
        if (res.canceled || !res.assets?.[0]?.base64) return;

        setImageBase64(res.assets[0].base64);

        const pos = await Location.getCurrentPositionAsync({});
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    };

    // збереження (онлайн → хмара+сервер, офлайн → локально)
    const handleSave = async ({ description, category, imageBase64 }) => {
        if (submittingRef.current) return; // анти-дубль
        submittingRef.current = true;
        const created_at = new Date().toISOString();
        setSaving(true);

        try {
            let doneRemote = false;

            if (await isOnline()) {
                // 1) вантажимо фото у Cloudinary
                const { secure_url, public_id } = await uploadBase64ToCloudinary(imageBase64);
                // 2) створюємо запис на сервері
                await createRemoteOffense({
                    description,
                    category,
                    createdAt: created_at,
                    coords,
                    photoUrl: secure_url,
                    photoId: public_id,
                });
                doneRemote = true;
            } else {
                // офлайн: зберігаємо локально
                await createLocalOffense({ description, category, imageBase64, createdAt: created_at, coords });
            }

            Alert.alert('OK', doneRemote ? 'Фото завантажено у хмару.' : 'Збережено локально (офлайн).');
        } catch (e) {
            // fallback: якщо сервер недоступний — дублюємо локально
            try {
                await createLocalOffense({ description, category, imageBase64, createdAt: created_at, coords });
                Alert.alert('OK', 'Сервер недоступний. Збережено локально.');
            } catch {
                Alert.alert('Помилка', 'Не вдалося зберегти запис.');
            }
        } finally {
            setSaving(false);
            submittingRef.current = false;
            setImageBase64(null);
            setCoords(null);
        }
    };

    return (
        <KeyboardAvoidingView
            style={s.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.select({ ios: 64, android: 0 })}
        >
            <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={s.title}>{t('screens.createTitle')}</Text>

                {/* форма створення порушення */}
                <OffenseForm
                    imageBase64={imageBase64}
                    onChangePhoto={saving ? undefined : takePhoto}
                    onSaved={handleSave}
                    loading={saving}
                    onCancel={() => setImageBase64(null)}
                />
            </ScrollView>

            {/* напівпрозорий оверлей під час збереження */}
            {saving && (
                <View style={s.overlay}>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        scrollContent: { padding: 16, paddingBottom: 32 },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 12,
        },
        coordsHint: {
            textAlign: 'center',
            color: colors.text,
            opacity: 0.7,
            marginBottom: 8,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
