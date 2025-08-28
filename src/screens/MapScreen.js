import { View, Text } from 'react-native';
import {useTheme} from "@react-navigation/native";

export default function MapScreen() {
    const { colors } = useTheme();
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '600', color: colors.text }}>Карта</Text>
        </View>
    );
}
