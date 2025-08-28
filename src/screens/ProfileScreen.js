import React from 'react';
import { View, Text } from 'react-native';
import {useTheme} from "@react-navigation/native";

export default function ProfileScreen() {
    const { colors } = useTheme();
    return (
        <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:22, fontWeight:'600', color: colors.text }}>Профіль</Text>
            <Text style={{ marginTop:8, color: colors.text }}>Порожня сторінка</Text>
        </View>
    );
}
