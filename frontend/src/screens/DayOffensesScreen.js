import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import OffenseList from '../components/offenses/OffenseList';
import { deleteOffenseRemoteById, listOffensesRemoteAll } from '../repositories/offensesRepo';

/**
 * DayOffensesScreen
 *
 * Екран списку порушень за конкретну дату (dateISO = 'yyyy-MM-dd').
 * Берe усі записи, фільтрує на клієнті за датою, показує список.
 *
 * Навігаційні параметри:
 * - route.params.dateISO: string ('yyyy-MM-dd') — дата, для якої показуємо записи.
 */
export default function DayOffensesScreen() {
    const { colors } = useTheme();
    const s = StyleSheet.create({
        wrap: { flex: 1, backgroundColor: colors.background, padding: 12 },
        empty: { textAlign: 'center', color: colors.text, opacity: 0.6, marginTop: 12 },
    });

    const route = useRoute();
    const navigation = useNavigation();

    // дата у форматі ISO, що прийшла з навігації
    const dateISO = route.params?.dateISO;

    // локальний список записів за обрану дату
    const [items, setItems] = useState([]);

    // завантаження + фільтрація по dateISO
    const load = useCallback(async () => {
        const all = await listOffensesRemoteAll();
        const filtered = (all || []).filter(x => {
            if (!x.createdAt) return false;
            return format(new Date(x.createdAt), 'yyyy-MM-dd') === dateISO;
        });
        setItems(filtered);
    }, [dateISO]);

    // встановлюємо заголовок екрана як читабельну дату
    useEffect(() => {
        if (dateISO) {
            const pretty = format(parseISO(dateISO), 'd LLLL yyyy');
            navigation.setOptions({ title: pretty });
        }
    }, [dateISO, navigation]);


    useFocusEffect(useCallback(() => { load(); }, [load]));


    const onDelete = async (id) => {
        await deleteOffenseRemoteById(id);
        await load();
    };

    return (
        <View style={s.wrap}>
            {items.length ? (
                <OffenseList data={items} onDelete={onDelete} />
            ) : (
                //якщо записів немає
                <Text style={s.empty}>Немає записів за цей день</Text>
            )}
        </View>
    );
}
