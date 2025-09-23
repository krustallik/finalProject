
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import OffenseList from '../components/offenses/OffenseList';
import {deleteOffenseRemoteById, listOffensesRemoteAll} from '../repositories/offensesRepo';

export default function DayOffensesScreen() {
    const { colors } = useTheme();
    const s = StyleSheet.create({
        wrap:{ flex:1, backgroundColor:colors.background, padding:12 },
        empty:{ textAlign:'center', color:colors.text, opacity:0.6, marginTop:12 },
    });

    const route = useRoute();
    const navigation = useNavigation();
    const dateISO = route.params?.dateISO;
    const [items, setItems] = useState([]);

    const load = useCallback(async () => {
        const all = await listOffensesRemoteAll();
        const filtered = (all||[]).filter(x => {
            if (!x.createdAt) return false;
            return format(new Date(x.createdAt), 'yyyy-MM-dd') === dateISO;
        });
        setItems(all);
    }, [dateISO]);

    useEffect(() => {
        if (dateISO) {
            const pretty = format(parseISO(dateISO), 'd LLLL yyyy');
            navigation.setOptions({ title: pretty });
        }
    }, [dateISO, navigation]);

    useEffect(() => { load(); }, [load]);
    useFocusEffect(useCallback(() => { load(); }, [load]));

    const onDelete = async (id) => { await deleteOffenseRemoteById(id); await load(); };

    return (
        <View style={s.wrap}>
            {items.length ? (
                <OffenseList data={items} onDelete={onDelete} />
            ) : (
                <Text style={s.empty}>Немає записів за цей день</Text>
            )}
        </View>
    );
}
