import React, {useEffect, useState, useCallback, useRef} from 'react';
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
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { initDb } from '../db/database';
import {
  listOffensesRemoteMine,
      createRemoteOffense,
      createLocalOffense,
    } from '../repositories/offensesRepo';
import OffenseForm from '../components/offenses/OffenseForm';
import { uploadBase64ToCloudinary } from '../services/cloudinary';
import { isOnline } from '../services/network';

export default function CreateOffenseScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);
    const submittingRef = useRef(false);

    const [imageBase64, setImageBase64] = useState(null);
    const [coords, setCoords] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        const rows = await listOffensesRemoteMine();
        setItems(rows);
    };

    useEffect(() => {
        (async () => {
            await initDb();
            await load();
        })();
    }, []);

    useFocusEffect(useCallback(() => { load(); }, []));

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

    const handleSave = async ({ description, category, imageBase64 }) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        const created_at = new Date().toISOString();
        setSaving(true);

        try {
            let doneRemote = false;

            if (await isOnline()) {

                const { secure_url, public_id } = await uploadBase64ToCloudinary(imageBase64);

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
                // офлайн одразу — пишемо локально
                await createLocalOffense({ description, category, imageBase64, createdAt: created_at, coords });
            }

            Alert.alert('OK', doneRemote ? 'Фото завантажено у хмару.' : 'Збережено локально (офлайн).');
        } catch (e) {
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
            await load();
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

                <OffenseForm
                    imageBase64={imageBase64}
                    onChangePhoto={saving ? undefined : takePhoto}
                    onSaved={handleSave}
                    loading={saving}
                    onCancel={() => setImageBase64(null)}
                />



            </ScrollView>

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
