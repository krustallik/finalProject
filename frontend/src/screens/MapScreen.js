import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { listOffenses } from '../repositories/offensesRepo';

export default function MapScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const s = makeStyles(colors);

    const mapRef = useRef(null);
    const [items, setItems] = useState([]);
    const [myPos, setMyPos] = useState(null);
    const [region, setRegion] = useState({
        latitude: 49.0,
        longitude: 31.0,
        latitudeDelta: 5,
        longitudeDelta: 5,
    });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const rows = await listOffenses();
                setItems(rows || []);

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') return;

                const pos = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });
                const p = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                setMyPos(p);

                const next = { ...p, latitudeDelta: 0.03, longitudeDelta: 0.03 };
                setRegion(next);
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
                {myPos && <Marker coordinate={myPos} title="Я тут" pinColor="blue" />}

                {items
                    .filter((x) => x.latitude != null && x.longitude != null)
                    .map((p) => (
                        <Marker
                            key={p.id}
                            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                            title={p.description}
                            description={p.category || undefined}
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
