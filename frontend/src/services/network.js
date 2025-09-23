
import * as Network from 'expo-network';

export async function isOnline() {
    try {
        const s = await Network.getNetworkStateAsync();
        return !!s.isConnected && s.isInternetReachable === true;
    } catch {
        return false;
    }
}


