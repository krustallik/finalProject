import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>
                {t('screens.profile')}
            </Text>
        </View>
    );
}
