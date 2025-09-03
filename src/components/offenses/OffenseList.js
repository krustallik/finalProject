import React from 'react';
import { FlatList, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import OffenseItem from './OffenseItem';

export default function OffenseList({ data, onDelete }) {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <FlatList
            data={data}
            keyExtractor={(it) => String(it.id)}
            renderItem={({ item }) => <OffenseItem item={item} onDelete={() => onDelete?.(item.id)} />}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
                <Text style={{ color: colors.text, opacity: 0.6, textAlign: 'center', marginTop: 20 }}>
                    {t('list.empty')}
                </Text>
            }
        />
    );
}
