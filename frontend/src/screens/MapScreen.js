import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { listOffensesRemoteAll } from '../repositories/offensesRepo';
import { DEMO_MODE } from '../config/demo';

/**
 * MapScreen
 *
 * Shows report markers on a map and centers on the user's location.
 *
 * State:
 * - items: список порушень (з координатами)
 * - region: поточна область карти
 *
 * Поведінка:
 * - On focus, loads reports and the user's location.
 * - In demo mode, frames all synthetic report locations.
 */
export default function MapScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { width, height } = useWindowDimensions();
    const s = makeStyles(colors);

    const mapRef = useRef(null);

    // Reports displayed on the map.
    const [items, setItems] = useState([]);
    const [region, setRegion] = useState({
        latitude: 48.7164,
        longitude: 21.2611,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
    });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                // Load every public report.
                const rows = await listOffensesRemoteAll();
                setItems(rows || []);

                // Frame all synthetic reports in the portfolio demo without requesting device location.
                if (DEMO_MODE) {
                    const points = (rows || []).filter((item) => item.latitude != null && item.longitude != null);
                    if (points.length) {
                        const latitudes = points.map((item) => Number(item.latitude));
                        const longitudes = points.map((item) => Number(item.longitude));
                        const minLatitude = Math.min(...latitudes);
                        const maxLatitude = Math.max(...latitudes);
                        const minLongitude = Math.min(...longitudes);
                        const maxLongitude = Math.max(...longitudes);
                        const latitude = (minLatitude + maxLatitude) / 2;
                        const longitude = (minLongitude + maxLongitude) / 2;
                        const mapAspect = width / Math.max(height - 160, width);
                        const longitudeScale = Math.cos((latitude * Math.PI) / 180);
                        const latitudeDelta = Math.max(
                            (maxLatitude - minLatitude) * 1.35,
                            ((maxLongitude - minLongitude) * longitudeScale * 1.35) / mapAspect,
                            0.025
                        );
                        const longitudeDelta = Math.max(
                            (maxLongitude - minLongitude) * 1.35,
                            (latitudeDelta * mapAspect) / longitudeScale
                        );
                        const next = { latitude, longitude, latitudeDelta, longitudeDelta };
                        setRegion(next);
                        mapRef.current?.animateToRegion(next, 700);
                    }
                    return;
                }

                // Request foreground location access.
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                // Read the current device position.
                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };

                // Center the map on the current position.
                const next = { ...p, latitudeDelta: 0.03, longitudeDelta: 0.03 };
                setRegion(next);

                // Animate to the new region.
                mapRef.current?.animateToRegion(next, 700);
            })();
        }, [height, width])
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
                {/* Only reports with coordinates can be shown as markers. */}
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
