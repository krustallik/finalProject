import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { listOffensesRemoteAll } from '../repositories/offensesRepo';

/**
 * MapScreen
 *
 * Екран карти, де відображаються всі порушення у вигляді маркерів.
 * Також центрує карту на поточній геолокації користувача.
 *
 * State:
 * - items: список порушень (з координатами)
 * - region: поточна область карти
 *
 * Поведінка:
 * - при фокусі екрана: завантажує всі порушення та отримує геопозицію користувача
 * - карта переміщується до поточної позиції
 */
export default function MapScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const mapRef = useRef(null);

    // список порушень
    const [items, setItems] = useState([]);
    const [region, setRegion] = useState({

    });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                // завантажуємо всі порушення
                const rows = await listOffensesRemoteAll();
                setItems(rows || []);

                // перевірка доступу до геолокації
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                // визначаємо поточну позицію
                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };

                // встановлюємо новий регіон карти
                const next = { ...p, latitudeDelta: 0.03, longitudeDelta: 0.03 };
                setRegion(next);

                //переміщення карти
                mapRef.current?.animateToRegion(next, 700);
            })();
        }, [])
    );

    return (
        <View style={s.container}>
            <Text style={s.title}>{t('screens.mapTitle')}</Text>

            <MapView
                ref={mapRef}
                style={s.map}
                region={region}
                onRegionChangeComplete={setRegion}
                showsUserLocation
            >
                {/* рендеримо маркери лише для тих записів, де є координати */}
                {items
                    .filter((x) => x.latitude != null && x.longitude != null)
                    .map((p) => (
                        <Marker
                            key={p.id}
                            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                            title={p.description}
                            description={[
                                p.category,
                                p.userName ? t('byUser', { user: p.userName }) : undefined,
                            ]
                                .filter(Boolean)
                                .join(' • ') || undefined}
                        />
                    ))}
            </MapView>
        </View>
    );
}

const makeStyles = (colors) =>
    StyleSheet.create({
        container: { flex: 1 },
        title: {
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
            paddingVertical: 8,
        },
        map: { flex: 1 },
    });
